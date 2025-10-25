"use strict";

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("produk", [
      {
        namaProduk: "Laptop Lenovo ThinkPad X1 Carbon",
        deskripsi: "Laptop bisnis premium dengan bodi ringan, performa tinggi, dan daya tahan baterai lama.",
        fotoProduk: "uploads/laptop-lenovo.jpg",
      },
      {
        namaProduk: "Mouse Logitech MX Master 3",
        deskripsi: "Mouse wireless ergonomis dengan sensor presisi tinggi dan daya tahan baterai hingga 70 hari.",
        fotoProduk: "uploads/mouse-logitech.jpg",
      },
      {
        namaProduk: "Monitor Dell UltraSharp 27",
        deskripsi: "Monitor 27 inci dengan resolusi QHD dan panel IPS untuk warna akurat.",
        fotoProduk: "uploads/monitor-dell.jpg",
      },
      {
        namaProduk: "Keyboard Mechanical Keychron K6",
        deskripsi: "Keyboard mechanical compact dengan switch tactile dan konektivitas Bluetooth.",
        fotoProduk: "uploads/keyboard-keychron.jpg",
      },
      {
        namaProduk: "himatif Keyboard Mechanical K6",
        deskripsi: "Keyboard mechanical compact dengan switch tactile dan konektivitas Bluetooth.",
        fotoProduk: "1761397572719-himatif.png",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("produk", null, {});
  },
};
