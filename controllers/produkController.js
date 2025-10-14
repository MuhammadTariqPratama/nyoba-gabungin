const Produk = require("../models/produk");
const Variasi = require("../models/variasi");
const path = require("path");

// Ambil semua produk (include variasi)
exports.getAll = async (req, res) => {
  try {
    const produk = await Produk.findAll({ include: "variasi" });
    res.json(produk);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ambil produk berdasarkan ID
exports.getById = async (req, res) => {
  try {
    const produk = await Produk.findByPk(req.params.id, { include: "variasi" });
    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    res.json(produk);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tambah produk baru
exports.create = async (req, res) => {
  try {
    const { namaProduk, deskripsi } = req.body;
    const fotoProduk = req.file ? `uploads/produk/${req.file.filename}` : null;

    const produk = await Produk.create({
      namaProduk,
      deskripsi,
      fotoProduk
    });

    res.json({ message: "Produk ditambahkan", produk });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update produk
exports.update = async (req, res) => {
  try {
    const { namaProduk, deskripsi } = req.body;
    const produk = await Produk.findByPk(req.params.id);

    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    let fotoProduk = produk.fotoProduk;
    if (req.file) {
      fotoProduk = `/images/${req.file.filename}`;
    }

    await produk.update({ namaProduk, deskripsi, fotoProduk });
    res.json({ message: "Produk berhasil diperbarui", produk });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hapus produk
exports.delete = async (req, res) => {
  try {
    const produk = await Produk.findByPk(req.params.id);
    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    await produk.destroy();
    res.json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
