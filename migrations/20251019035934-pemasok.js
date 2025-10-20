"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pemasok", {
      pemasokID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      namaPemasok: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      alamatPemasok: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      noTelp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      keterangan: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("pemasok");
  },
};
