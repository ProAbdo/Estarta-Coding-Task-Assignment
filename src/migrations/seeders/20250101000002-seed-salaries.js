'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Salaries', [
      { id: 1, year: 2025, month: 1, salary: 1200, user_id: 1 },
      { id: 2, year: 2025, month: 2, salary: 1300, user_id: 1 },
      { id: 3, year: 2025, month: 3, salary: 1400, user_id: 1 },
      { id: 4, year: 2025, month: 5, salary: 1500, user_id: 1 },
      { id: 5, year: 2025, month: 6, salary: 1600, user_id: 1 },
      { id: 6, year: 2025, month: 1, salary: 900, user_id: 2 },
      { id: 7, year: 2025, month: 2, salary: 950, user_id: 2 },
      { id: 8, year: 2025, month: 3, salary: 980, user_id: 2 },
      { id: 9, year: 2025, month: 4, salary: 1100, user_id: 2 },
      { id: 10, year: 2025, month: 5, salary: 1150, user_id: 2 },
      { id: 11, year: 2025, month: 1, salary: 400, user_id: 3 },
      { id: 15, year: 2025, month: 5, salary: 800, user_id: 3 },
      { id: 16, year: 2025, month: 1, salary: 2000, user_id: 4 },
      { id: 17, year: 2025, month: 2, salary: 2050, user_id: 4 },
      { id: 18, year: 2025, month: 3, salary: 2100, user_id: 4 },
      { id: 19, year: 2025, month: 4, salary: 2200, user_id: 4 },
      { id: 20, year: 2025, month: 5, salary: 2300, user_id: 4 },
      { id: 21, year: 2025, month: 1, salary: 600, user_id: 5 },
      { id: 22, year: 2025, month: 2, salary: 700, user_id: 5 },
      { id: 23, year: 2025, month: 3, salary: 750, user_id: 5 },
      { id: 25, year: 2025, month: 5, salary: 850, user_id: 5 },
      { id: 26, year: 2025, month: 11, salary: 1500, user_id: 6 },
      { id: 27, year: 2025, month: 12, salary: 1550, user_id: 6 },
      { id: 28, year: 2025, month: 1, salary: 1600, user_id: 6 },
      { id: 29, year: 2025, month: 2, salary: 1650, user_id: 6 },
      { id: 30, year: 2025, month: 3, salary: 1700, user_id: 6 },
      { id: 31, year: 2025, month: 4, salary: 2000, user_id: 6 },
      { id: 32, year: 2025, month: 1, salary: 1000, user_id: 7 },
      { id: 33, year: 2025, month: 2, salary: 1100, user_id: 7 },
      { id: 34, year: 2025, month: 3, salary: 1150, user_id: 7 },
      { id: 35, year: 2025, month: 4, salary: 1200, user_id: 7 },
      { id: 36, year: 2025, month: 5, salary: 1250, user_id: 7 },
      { id: 37, year: 2025, month: 6, salary: 1350, user_id: 7 },
      { id: 38, year: 2025, month: 7, salary: 1500, user_id: 7 },
      { id: 39, year: 2025, month: 10, salary: 2200, user_id: 8 },
      { id: 40, year: 2025, month: 11, salary: 2300, user_id: 8 },
      { id: 41, year: 2025, month: 12, salary: 2400, user_id: 8 },
      { id: 42, year: 2025, month: 1, salary: 2500, user_id: 8 },
      { id: 43, year: 2025, month: 2, salary: 2600, user_id: 8 },
      { id: 44, year: 2025, month: 3, salary: 2800, user_id: 8 },
      { id: 45, year: 2025, month: 1, salary: 1700, user_id: 9 },
      { id: 46, year: 2025, month: 2, salary: 1750, user_id: 9 },
      { id: 47, year: 2025, month: 6, salary: 1800, user_id: 9 },
      { id: 48, year: 2025, month: 7, salary: 1850, user_id: 9 },
      { id: 49, year: 2025, month: 8, salary: 1900, user_id: 9 },
      { id: 50, year: 2025, month: 1, salary: 800, user_id: 10 },
      { id: 51, year: 2025, month: 2, salary: 850, user_id: 10 },
      { id: 52, year: 2025, month: 3, salary: 900, user_id: 10 },
      { id: 53, year: 2025, month: 8, salary: 950, user_id: 10 },
      { id: 54, year: 2025, month: 9, salary: 1000, user_id: 10 },
      { id: 55, year: 2025, month: 10, salary: 1200, user_id: 10 }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Salaries', null, {});
  }
};
