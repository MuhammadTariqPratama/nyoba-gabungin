const { DataTypes } = require("sequelize");
const sequelize = require("./index");
const Produk = require("./produk");

const Variasi = sequelize.define("Variasi", {
  variasiID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  produkID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Produk,
      key: "produkID"
    }
  },
  namaVariasi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  harga: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  stok: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  fotoVariasi: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: "Variasi",
  timestamps: true
});

// Relasi
Produk.hasMany(Variasi, { foreignKey: "produkID", as: "variasi" });
Variasi.belongsTo(Produk, { foreignKey: "produkID", as: "produk" });

module.exports = Variasi;
