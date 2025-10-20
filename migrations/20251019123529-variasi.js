"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("variasi", {
      variasiID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      produkID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "produk", // mengacu ke tabel Produk
          key: "produkID",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      namaVariasi: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      harga: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      stok: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      fotoVariasi: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("variasi");
  },
};