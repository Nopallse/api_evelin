const Sequelize = require("sequelize");
const db = require("../config/database.js");
const Event = require("./EventModel.js");
const { DataTypes } = Sequelize;

const EventParticipant = db.define("EventParticipant", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Events", // Nama tabel yang dirujuk
      key: "id", // Kolom yang dirujuk
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
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
  tableName: "EventParticipants", // Sesuai nama tabel di database
  timestamps: true, // Gunakan `createdAt` dan `updatedAt`
});

// EventParticipant.belongsTo(Event, { foreignKey: "id" });
EventParticipant.belongsTo(Event, { foreignKey: "eventId" });

module.exports = EventParticipant;