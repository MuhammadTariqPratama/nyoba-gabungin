const { Op } = require("sequelize");
const Produk = require("../models/produk");
const Variasi = require("../models/variasi");

// Ambil semua produk (include variasi) dengan pagination, search
exports.getAll = async (req, res) => {
  try {
    // Ambil query parameter dari URL
    const page = parseInt(req.query.page) || 1; // halaman saat ini
    const limit = parseInt(req.query.limit) || 10; // jumlah data per halaman
    const search = req.query.search || ""; // pencarian nama produk
    const filter = req.query.filter || ""; // filter kategori atau lainnya jika ada

    // Hitung offset (data awal)
    const offset = (page - 1) * limit;

    // Kondisi pencarian dan filter
    const whereClause = {};

    // Jika ada pencarian namaProduk
    if (search) {
      whereClause.namaProduk = { [Op.like]: `%${search}%` };
    }

    // Ambil data dengan kondisi, pagination, dan relasi variasi
    const { rows: produk, count: totalItems } = await Produk.findAndCountAll({
      where: whereClause,
      include: [{ model: Variasi, as: "variasi" }],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      currentPage: page,
      totalPages,
      totalItems,
      perPage: limit,
      data: produk,
    });
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
      fotoProduk,
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
      fotoProduk = `uploads/produk/${req.file.filename}`;
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
