const AlurBarang = require("../models/alurBarang");
const Admin = require("../models/admin");
const Variasi = require("../models/variasi");

// ==================== Ambil Semua Alur Barang ====================
exports.getAll = async (req, res) => {
  try {
    const alurBarang = await AlurBarang.findAll({
      include: [
        { model: Admin, as: "admin", attributes: ["adminID", "username"] },
        { model: Variasi, as: "variasi", attributes: ["variasiID", "namaVariasi", "stok", "harga"] },
      ],
    });

    res.json({
      message: `Berhasil mengambil ${alurBarang.length} data alur barang.`,
      data: alurBarang,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data alur barang.", error: err.message });
  }
};

// ==================== Ambil Berdasarkan ID ====================
exports.getById = async (req, res) => {
  try {
    const alurBarang = await AlurBarang.findByPk(req.params.id, {
      include: [
        { model: Admin, as: "admin", attributes: ["adminID", "username"] },
        { model: Variasi, as: "variasi", attributes: ["variasiID", "namaVariasi", "stok", "harga"] },
      ],
    });

    if (!alurBarang) {
      return res.status(404).json({ message: `Alur barang dengan ID ${req.params.id} tidak ditemukan.` });
    }

    res.json({
      message: `Berhasil mengambil data alur barang dengan ID ${req.params.id}.`,
      data: alurBarang,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data alur barang.", error: err.message });
  }
};

// ==================== Tambah Alur Barang ====================
exports.create = async (req, res) => {
  try {
    const { jenisAlur, tanggal, jumlah, lokasiProduk, keterangan, variasiID, adminID } = req.body;

    // Validasi input
    if (!jenisAlur || !tanggal || !jumlah || !variasiID || !adminID) {
      return res.status(400).json({ message: "Data jenisAlur, tanggal, jumlah, variasiID, dan adminID wajib diisi." });
    }

    const alurBarang = await AlurBarang.create({
      jenisAlur,
      tanggal,
      jumlah,
      lokasiProduk,
      keterangan,
      variasiID,
      adminID,
    });

    res.status(201).json({
      message: `Alur barang baru berhasil ditambahkan.`,
      data: alurBarang,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal menambahkan data alur barang.", error: err.message });
  }
};

// ==================== Update Alur Barang ====================
exports.update = async (req, res) => {
  try {
    const { jenisAlur, tanggal, jumlah, lokasiProduk, keterangan, variasiID, adminID } = req.body;
    const alurBarang = await AlurBarang.findByPk(req.params.id);

    if (!alurBarang) {
      return res.status(404).json({ message: `Alur barang dengan ID ${req.params.id} tidak ditemukan.` });
    }

    await alurBarang.update({
      jenisAlur,
      tanggal,
      jumlah,
      lokasiProduk,
      keterangan,
      variasiID,
      adminID,
    });

    res.json({
      message: `Data alur barang dengan ID ${req.params.id} berhasil diperbarui.`,
      data: alurBarang,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal memperbarui data alur barang.", error: err.message });
  }
};

// ==================== Hapus Alur Barang ====================
exports.delete = async (req, res) => {
  try {
    const alurBarang = await AlurBarang.findByPk(req.params.id);

    if (!alurBarang) {
      return res.status(404).json({ message: `Alur barang dengan ID ${req.params.id} tidak ditemukan.` });
    }

    await alurBarang.destroy();
    res.json({
      message: `Alur barang dengan ID ${req.params.id} berhasil dihapus.`,
      deletedData: alurBarang,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus data alur barang.", error: err.message });
  }
};
