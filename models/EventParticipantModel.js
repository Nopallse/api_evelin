const Sequelize = require("sequelize");
const db = require("../config/database.js");

const { DataTypes } = Sequelize;

const EventParticipant = db.define("EventParticipant", {
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
      model: "Users", // Nama tabel relasi
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Events", // Nama tabel relasi
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
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
  tableName: "EventParticipants", // Nama tabel di database
  timestamps: true, // Otomatis gunakan `createdAt` dan `updatedAt`
});

module.exports = EventParticipant;
