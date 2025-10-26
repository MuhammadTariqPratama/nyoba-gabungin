const { Op } = require("sequelize");
const Variasi = require("../models/variasi");
const Produk = require("../models/produk");

// Ambil semua variasi dengan pagination, search, dan filter harga
exports.getAll = async (req, res) => {
  try {
    // Ambil parameter query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const minHarga = parseFloat(req.query.minHarga) || 0;
    const maxHarga = parseFloat(req.query.maxHarga) || Number.MAX_VALUE;

    const offset = (page - 1) * limit;

    // Buat kondisi pencarian dan filter harga
    const whereClause = {
      [Op.and]: [
        { harga: { [Op.between]: [minHarga, maxHarga] } },
      ],
    };

    if (search) {
      whereClause[Op.and].push({
        namaVariasi: { [Op.like]: `%${search}%` },
      });
    }

    // Ambil data dari database
    const { rows: variasi, count: totalItems } = await Variasi.findAndCountAll({
      where: whereClause,
      include: { model: Produk, as: "produk" },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      message: "Data variasi berhasil diambil",
      currentPage: page,
      totalPages,
      totalItems,
      perPage: limit,
      data: variasi,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ambil variasi berdasarkan ID
exports.getById = async (req, res) => {
  try {
    const variasi = await Variasi.findByPk(req.params.id, {
      include: { model: Produk, as: "produk" },
    });

    if (!variasi) {
      return res.status(404).json({ message: "Variasi tidak ditemukan" });
    }

    res.status(200).json({ message: `Data variasi dengan ID ${req.params.id} berhasil diambil` }); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tambah variasi baru
exports.create = async (req, res) => {
  try {
    const { produkID, namaVariasi, harga, stok } = req.body;
    const fotoVariasi = req.file ? `uploads/variasi/${req.file.filename}` : null;

    const variasi = await Variasi.create({
      produkID,
      namaVariasi,
      harga,
      stok,
      fotoVariasi,
    });

    res.status(201).json({ message: "Variasi ditambahkan", variasi });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update variasi
exports.update = async (req, res) => {
  try {
    const { namaVariasi, harga, stok } = req.body;
    const variasi = await Variasi.findByPk(req.params.id);

    if (!variasi) {
      return res.status(404).json({ message: "Variasi tidak ditemukan" });
    }

    let fotoVariasi = variasi.fotoVariasi;
    if (req.file) {
      fotoVariasi = `uploads/variasi/${req.file.filename}`;
    }

    await variasi.update({
      namaVariasi: namaVariasi || variasi.namaVariasi,
      harga: harga || variasi.harga,
      stok: stok !== undefined ? stok : variasi.stok,
      fotoVariasi,
    });

    res.status(200).json({ message: "Variasi diperbarui", variasi });
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
    res.status(204).json({ message: "Variasi dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
