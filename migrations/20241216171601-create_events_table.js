// migrations/YYYYMMDDHHMMSS-create-event.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Events', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      eventDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      university: {
        type: Sequelize.STRING,
        defaultValue: 'Universitas Andalas'
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      speaker: {
        type: Sequelize.STRING,
        allowNull: true
      },
      posterUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Events');
  }
};