// seeders/YYYYMMDDHHMMSS-demo-event-participants.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, get existing user and event IDs
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM `Users` LIMIT 4;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const events = await queryInterface.sequelize.query(
      'SELECT id FROM `Events` LIMIT 2;', 
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Ensure we have enough users and events
    if (users.length < 4 || events.length < 2) {
      console.log('Not enough users or events. Please seed users and events first.');
      return;
    }

    const demoParticipants = [
      {
        userId: users[1].id,  // Second user
        eventId: events[0].id,  // First event
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: users[2].id,  // Third user
        eventId: events[0].id,  // First event
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: users[3].id,  // Fourth user
        eventId: events[1].id,  // Second event
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: users[0].id,  // First user
        eventId: events[1].id,  // Second event
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('EventParticipants', demoParticipants, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('EventParticipants', null, {});
  }
};