"use strict";

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "admin",
      [
        {
          username: "admin_master",
          password: "admin123", // sementara plain text
        },
        {
          username: "staff_gudang",
          password: "staff123",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("admin", null, {});
  },
};
