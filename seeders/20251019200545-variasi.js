"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("variasi", [
      {
        produkID: 1, // pastikan produkID ini sudah ada di tabel 'produk'
        namaVariasi: "Ukuran Kecil",
        harga: 25000.00,
        stok: 100,
        fotoVariasi: "variasi_kecil.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        produkID: 2,
        namaVariasi: "Ukuran Sedang",
        harga: 35000.00,
        stok: 80,
        fotoVariasi: "variasi_sedang.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        produkID: 3, // contoh variasi produk lain
        namaVariasi: "Warna Merah",
        harga: 40000.00,
        stok: 50,
        fotoVariasi: "variasi_merah.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        produkID: 4,
        namaVariasi: "Warna Hitam",
        harga: 42000.00,
        stok: 40,
        fotoVariasi: "variasi_hitam.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("variasi", null, {});
  },
};
