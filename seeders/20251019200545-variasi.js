"use strict";

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("variasi", [
      {
        produkID: 1,
        namaVariasi: "Ukuran Kecil",
        harga: 25000.0,
        stok: 100,
        fotoVariasi: "variasi_kecil.jpg",
      },
      {
        produkID: 2,
        namaVariasi: "Ukuran Sedang",
        harga: 35000.0,
        stok: 80,
        fotoVariasi: "variasi_sedang.jpg",
      },
      {
        produkID: 3,
        namaVariasi: "Warna Merah",
        harga: 40000.0,
        stok: 50,
        fotoVariasi: "variasi_merah.jpg",
      },
      {
        produkID: 4,
        namaVariasi: "Warna Hitam",
        harga: 42000.0,
        stok: 40,
        fotoVariasi: "variasi_hitam.jpg",
      },
      {
        produkID: 5,
        namaVariasi: "Ukuran Sedang",
        harga: 35000.0,
        stok: 80,
        fotoVariasi: "variasi_sedang.jpg",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("variasi", null, {});
  },
};
