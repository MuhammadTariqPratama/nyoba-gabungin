const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Produk = sequelize.define("Produk", {
  produkID: { 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  namaProduk: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  deskripsi: { 
    type: DataTypes.TEXT,
    allowNull: true
  },
  fotoProduk: { 
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: "Produk",
  timestamps: true
});

module.exports = Produk;
