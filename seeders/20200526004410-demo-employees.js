'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('employees', [{
      email: '1612434@student.hcmus.edu.vn',
      name: 'Lưu Tuấn Nguyên',
      password: '$2a$08$2UdW9lFdKV3LphhZMVaAROibklNye9639kodWYa5uLG9wMI0GOVeK', //password hashed from 123456789,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: '1612380@student.hcmus.edu.vn',
      name: 'Phạm Hoàng Minh',
      password: '$2a$08$2UdW9lFdKV3LphhZMVaAROibklNye9639kodWYa5uLG9wMI0GOVeK', //password hashed from 123456789,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: '1612426@student.hcmus.edu.vn',
      name: 'Hoàng Nghĩa',
      password: '$2a$08$2UdW9lFdKV3LphhZMVaAROibklNye9639kodWYa5uLG9wMI0GOVeK', //password hashed from 123456789,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {
      individualHooks: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('employees', null, {});
  }
};
