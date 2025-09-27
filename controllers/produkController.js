const Produk = require("../models/produk");

// Ambil semua produk
exports.getAll = async (req, res) => {
  try {
    const produk = await Produk.findAll();
    res.json(produk);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ambil produk berdasarkan ID
exports.getById = async (req, res) => {
  try {
    const produk = await Produk.findByPk(req.params.id);
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
    const { nama, harga } = req.body;
    const produk = await Produk.create({ nama, harga });
    res.json({ message: "Produk ditambahkan", produk });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update produk
exports.update = async (req, res) => {
  try {
    const { nama, harga } = req.body;
    const produk = await Produk.findByPk(req.params.id);
    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    await produk.update({ nama, harga });
    res.json({ message: "Produk diperbarui", produk });
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
    res.json({ message: "Produk dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
