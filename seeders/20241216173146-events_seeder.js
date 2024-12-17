// seeders/YYYYMMDDHHMMSS-demo-events.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, make sure to get existing user IDs
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM `Users` LIMIT 2;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Ensure we have at least one user
    if (users.length === 0) {
      console.log('No users found. Please seed users first.');
      return;
    }

    const demoEvents = [
      {
        userId: users[0].id,
        title: 'Seminar Teknologi Informasi',
        description: 'Seminar nasional tentang perkembangan teknologi informasi terkini',
        eventDate: new Date('2024-07-15T10:00:00'),
        location: 'Gedung Rektorat Universitas Andalas',
        university: 'Universitas Andalas',
        category: 'Seminar',
        speaker: 'Dr. Teknologi Informasi',
        posterUrl: 'https://example.com/poster-seminar.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: users[0].id,
        title: 'Workshop Kewirausahaan',
        description: 'Workshop praktis untuk mahasiswa yang ingin memulai bisnis',
        eventDate: new Date('2024-08-20T14:00:00'),
        location: 'Aula Kampus Universitas Andalas',
        university: 'Universitas Andalas',
        category: 'Workshop',
        speaker: 'Pengusaha Sukses',
        posterUrl: 'https://example.com/poster-workshop.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Events', demoEvents, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Events', null, {});
  }
};