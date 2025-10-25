"use strict";

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("pemasok", [
      {
        namaPemasok: "PT Sumber Makmur",
        alamatPemasok: "Jl. Soekarno Hatta No. 45, Bengkulu",
        noTelp: "081234567890",
        keterangan: "Pemasok bahan elektronik",
        email: "kontak@sumbermakmur.co.id",
      },
      {
        namaPemasok: "CV Sentosa Abadi",
        alamatPemasok: "Jl. Fatmawati No. 22, Jakarta Selatan",
        noTelp: "082345678901",
        keterangan: "Pemasok perlengkapan komputer",
        email: "info@sentosaabadi.com",
      },
      {
        namaPemasok: "UD Cahaya Mandiri",
        alamatPemasok: "Jl. Anggrek No. 10, Bandung",
        noTelp: "083456789012",
        keterangan: "Pemasok kebutuhan alat tulis kantor",
        email: "udcahayamandiri@gmail.com",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("pemasok", null, {});
  },
};
