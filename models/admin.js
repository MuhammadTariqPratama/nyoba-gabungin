const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Admin = sequelize.define("Admin", {
  adminID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "admin",
  timestamps: false,
});

module.exports = Admin;
