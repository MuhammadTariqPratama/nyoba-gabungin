"use strict";

const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Enkripsi password sebelum diinsert
    const hashedAdmin = await bcrypt.hash("admin123", 10);
    const hashedStaff = await bcrypt.hash("staff123", 10);

    await queryInterface.bulkInsert(
      "admin",
      [
        {
          username: "admin_master",
          password: hashedAdmin,
        },
        {
          username: "staff_gudang",
          password: hashedStaff,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("admin", null, {});
  },
};
