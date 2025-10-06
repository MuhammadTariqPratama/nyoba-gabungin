const { DataTypes } = require("sequelize");
const sequelize = require("./index");
const Admin = require("./admin");
const Variasi = require("./variasi");

const AlurBarang = sequelize.define("AlurBarang", {
  alurBarangID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  jenisAlur: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tanggal: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  jumlah: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lokasiProduk: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  variasiID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "variasi",
      key: "variasiID",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  adminID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "admin",
      key: "adminID",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
}, {
  tableName: "alurbarang",
  timestamps: false,
});

// ====================== RELASI ======================
AlurBarang.belongsTo(Admin, { foreignKey: "adminID", as: "admin" });
AlurBarang.belongsTo(Variasi, { foreignKey: "variasiID", as: "variasi" });

Admin.hasMany(AlurBarang, { foreignKey: "adminID", as: "alurBarang" });
Variasi.hasMany(AlurBarang, { foreignKey: "variasiID", as: "alurBarang" });

// ====================================================

module.exports = AlurBarang;