import httpStatusCodes from 'http-status-codes'
import crypto from 'crypto'
import NodeRSA from 'node-rsa'
import { sortObject } from '../utils/objectHandler'
import { HASH_SECRET, PARTNER_REQUEST_EXPIRED_TIME, RSA_PUBLIC_KEY } from '../config'

const partnerPublicKey = new NodeRSA(RSA_PUBLIC_KEY)

//validate property of req by schema
export const schemaValidator = (schema, property) => {
  //property: body, params, query,...
  return async (req, res, next) => {
    const { error } = await schema.validate(req[property])

    if (!error) {
      next()
    }
    else {
      const { details } = error
      const errMessage = details.map(detail => detail.message).join(',')
      res.status(httpStatusCodes.BAD_REQUEST).json({ message: errMessage })
    }
  }
}

//check if req is expired with createdAt field in req[property]
export const expiryValidator = (property) => {
  return async (req, res, next) => {
    const { createdAt } = req[property]
    const now = new Date()
    const reqCreatedAt = new Date(createdAt)

    const elapsedTimeInMilliseconds = now.getTime() - reqCreatedAt.getTime()

    if (elapsedTimeInMilliseconds > PARTNER_REQUEST_EXPIRED_TIME) {
      res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Request is expired.' })
    }
    else {
      next()
    }
  }
}

//validate if other keys was modified or not
export const secureHashValidator = (property) => {
  return async (req, res, next) => {
    const propertyObject = sortObject(req[property])
    const queryHash = propertyObject.secureHash
    delete propertyObject.secureHash

    const stringifiedPropertyObject = JSON.stringify(propertyObject)
    const hash = crypto.createHmac('sha256', HASH_SECRET).update(stringifiedPropertyObject).digest('hex')

    if (hash === queryHash) {
      next()
    }
    else {
      res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'This request is not secured.' })
    }
  }
}

export const asymmetricSignatureVerification = () => {
  return async (req, res, next) => {
    const { signature } = req.body
    delete req.body.signature

    const isVerified = partnerPublicKey.verify(req.body, signature, 'base64', 'base64')

    if (isVerified) {
      next()
    }
    else {
      res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Invalid signature' })
    }
  }
}
