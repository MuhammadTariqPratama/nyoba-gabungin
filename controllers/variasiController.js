const Variasi = require("../models/variasi");
const Produk = require("../models/produk");

// Ambil semua variasi beserta produk
exports.getAll = async (req, res) => {
  try {
    const variasi = await Variasi.findAll({
      include: { model: Produk, as: "produk" }
    });
    res.json(variasi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ambil variasi berdasarkan ID
exports.getById = async (req, res) => {
  try {
    const variasi = await Variasi.findByPk(req.params.id, {
      include: { model: Produk, as: "produk" }
    });

    if (!variasi) {
      return res.status(404).json({ message: "Variasi tidak ditemukan" });
    }

    res.json(variasi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tambah variasi baru
exports.create = async (req, res) => {
  try {
    const { produkID, namaVariasi, harga, stok, fotoVariasi } = req.body;

    // Validasi input
    if (!produkID || !namaVariasi || !harga) {
      return res.status(400).json({ message: "produkID, namaVariasi, dan harga wajib diisi" });
    }

    // Pastikan produk ada
    const produk = await Produk.findByPk(produkID);
    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    const variasi = await Variasi.create({
      produkID,
      namaVariasi,
      harga,
      stok: stok || 0,
      fotoVariasi
    });

    res.status(201).json({
      message: "Variasi ditambahkan",
      variasi
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update variasi
exports.update = async (req, res) => {
  try {
    const { namaVariasi, harga, stok, fotoVariasi } = req.body;
    const variasi = await Variasi.findByPk(req.params.id);

    if (!variasi) {
      return res.status(404).json({ message: "Variasi tidak ditemukan" });
    }

    await variasi.update({
      namaVariasi: namaVariasi || variasi.namaVariasi,
      harga: harga || variasi.harga,
      stok: stok !== undefined ? stok : variasi.stok,
      fotoVariasi: fotoVariasi || variasi.fotoVariasi
    });

    res.json({
      message: "Variasi diperbarui",
      variasi
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hapus variasi
exports.delete = async (req, res) => {
  try {
    const variasi = await Variasi.findByPk(req.params.id);

    if (!variasi) {
      return res.status(404).json({ message: "Variasi tidak ditemukan" });
    }

    await variasi.destroy();
    res.json({ message: "Variasi dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
