const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Pemasok = sequelize.define("Pemasok", {
  pemasokID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  namaPemasok: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  alamatPemasok: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  noTelp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
}, {
  tableName: "pemasok",
  timestamps: false,
});

module.exports = Pemasok;
