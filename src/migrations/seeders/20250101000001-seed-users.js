'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      { id: 1, username: 'jdoe', national_number: 'NAT1001', email: 'jdoe@example.com', phone: '0791111111', is_active: 1 },
      { id: 2, username: 'asalem', national_number: 'NAT1002', email: 'asalem@example.com', phone: '0792222222', is_active: 1 },
      { id: 3, username: 'rhamdan', national_number: 'NAT1003', email: 'rhamdan@example.com', phone: '0793333333', is_active: 0 },
      { id: 4, username: 'lbarakat', national_number: 'NAT1004', email: 'lbarakat@example.com', phone: '0794444444', is_active: 1 },
      { id: 5, username: 'mfaris', national_number: 'NAT1005', email: 'mfaris@example.com', phone: '0795555555', is_active: 1 },
      { id: 6, username: 'nsaleh', national_number: 'NAT1006', email: 'nsaleh@example.com', phone: '0796666666', is_active: 0 },
      { id: 7, username: 'zobeidat', national_number: 'NAT1007', email: 'zobeidat@example.com', phone: '0797777777', is_active: 1 },
      { id: 8, username: 'ahalaseh', national_number: 'NAT1008', email: 'ahalaseh@example.com', phone: '0798888888', is_active: 1 },
      { id: 9, username: 'tkhalaf', national_number: 'NAT1009', email: 'tkhalaf@example.com', phone: '0799999999', is_active: 0 },
      { id: 10, username: 'sshaheen', national_number: 'NAT1010', email: 'sshaheen@example.com', phone: '0781010101', is_active: 1 },
      { id: 11, username: 'tmart', national_number: 'NAT1011', email: 'tmart@example.com', phone: '0781099101', is_active: 0 },
      { id: 12, username: 'aali', national_number: 'NAT1012', email: 'aali@example.com', phone: '0781088101', is_active: 1 }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
