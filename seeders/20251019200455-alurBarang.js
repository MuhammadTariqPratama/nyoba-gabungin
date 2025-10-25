"use strict";

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("alurBarang", [
      {
        jenisAlur: "Masuk",
        tanggal: new Date("2025-10-15"),
        jumlah: 100,
        lokasiProduk: "Gudang Utama",
        keterangan: "Barang baru diterima dari pemasok.",
        variasiID: 1, // disesuaikan
        adminID: 1,
      },
      {
        jenisAlur: "Keluar",
        tanggal: new Date("2025-10-17"),
        jumlah: 30,
        lokasiProduk: "Toko Cabang 1",
        keterangan: "Pengiriman produk ke cabang.",
        variasiID: 2, // disesuaikan
        adminID: 1,
      },
      {
        jenisAlur: "Masuk",
        tanggal: new Date("2025-10-18"),
        jumlah: 50,
        lokasiProduk: "Gudang B",
        keterangan: "Restock produk dari supplier tambahan.",
        variasiID: 3, // disesuaikan
        adminID: 1,
      },
      {
        jenisAlur: "Keluar",
        tanggal: new Date("2025-10-19"),
        jumlah: 10,
        lokasiProduk: "Toko Online",
        keterangan: "Penjualan online (e-commerce).",
        variasiID: 4, // disesuaikan
        adminID: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("alurBarang", null, {});
  },
};
