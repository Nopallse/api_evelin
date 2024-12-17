// migrations/YYYYMMDDHHMMSS-create-event-participants.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EventParticipants', {
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
      eventId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Events',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending'
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

    // Create a unique constraint to prevent duplicate event participation
    await queryInterface.addConstraint('EventParticipants', {
      type: 'unique',
      fields: ['userId', 'eventId'],
      name: 'unique_user_event_participation'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EventParticipants');
  }
};