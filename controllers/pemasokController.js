const Pemasok = require("../models/pemasok");

// Ambil semua pemasok
exports.getAll = async (req, res) => {
  try {
    const pemasok = await Pemasok.findAll();
    res.json({
      message: `Berhasil mengambil ${pemasok.length} data pemasok.`,
      data: pemasok,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data pemasok.", error: err.message });
  }
};

// Ambil pemasok berdasarkan ID
exports.getById = async (req, res) => {
  try {
    const pemasok = await Pemasok.findByPk(req.params.id);
    if (!pemasok) {
      return res.status(404).json({ message: `Pemasok dengan ID ${req.params.id} tidak ditemukan.` });
    }
    res.json({
      message: `Berhasil mengambil data pemasok dengan ID ${req.params.id}.`,
      data: pemasok,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data pemasok.", error: err.message });
  }
};

// Tambah pemasok baru
exports.create = async (req, res) => {
  try {
    const { namaPemasok, alamatPemasok, noTelp, keterangan, email } = req.body;
    const pemasok = await Pemasok.create({ namaPemasok, alamatPemasok, noTelp, keterangan, email });
    res.status(201).json({
      message: `Pemasok "${namaPemasok}" berhasil ditambahkan.`,
      data: pemasok,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal menambahkan pemasok.", error: err.message });
  }
};

// Update pemasok
exports.update = async (req, res) => {
  try {
    const { namaPemasok, alamatPemasok, noTelp, keterangan, email } = req.body;
    const pemasok = await Pemasok.findByPk(req.params.id);

    if (!pemasok) {
      return res.status(404).json({ message: `Pemasok dengan ID ${req.params.id} tidak ditemukan.` });
    }

    await pemasok.update({ namaPemasok, alamatPemasok, noTelp, keterangan, email });
    res.json({
      message: `Data pemasok dengan ID ${req.params.id} berhasil diperbarui.`,
      data: pemasok,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal memperbarui data pemasok.", error: err.message });
  }
};

// Hapus pemasok
exports.delete = async (req, res) => {
  try {
    const pemasok = await Pemasok.findByPk(req.params.id);
    if (!pemasok) {
      return res.status(404).json({ message: `Pemasok dengan ID ${req.params.id} tidak ditemukan.` });
    }

    await pemasok.destroy();
    res.json({
      message: `Pemasok dengan ID ${req.params.id} berhasil dihapus.`,
      deletedData: pemasok,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus pemasok.", error: err.message });
  }
};
