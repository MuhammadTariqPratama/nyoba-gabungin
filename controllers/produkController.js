const Produk = require("../models/produk");
const Variasi = require("../models/variasi");

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
    const { namaProduk, deskripsi, fotoProduk } = req.body;

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
    const { namaProduk, deskripsi, fotoProduk } = req.body;
    const produk = await Produk.findByPk(req.params.id);

    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    await produk.update({ namaProduk, deskripsi, fotoProduk });
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
