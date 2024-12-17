const Sequelize = require("sequelize");
const db = require("../config/database.js");

const { DataTypes } = Sequelize;

const Event = db.define("Event", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users", // Nama tabel yang dirujuk
      key: "id", // Kolom yang dirujuk
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  university: {
    type: DataTypes.STRING,
    defaultValue: "Universitas Andalas",
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  speaker: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  posterUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
}, {
  tableName: "Events", // Sesuai nama tabel di database
  timestamps: true, // Gunakan `createdAt` dan `updatedAt`
});

module.exports = Event;
