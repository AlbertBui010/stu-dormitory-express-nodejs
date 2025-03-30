"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get existing dormitory IDs to link rooms
    const dormitories = await queryInterface.sequelize.query(
      'SELECT id FROM "Dormitory";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!dormitories.length) {
      console.log("No dormitories found. Please run dormitory seeds first.");
      return;
    }

    const rooms = [];
    const roomTypes = ["Single", "Double", "Triple", "Quad"];
    const statusTypes = ["Available", "Occupied", "Maintenance"];

    // Generate 5 rooms for each dormitory
    for (const dormitory of dormitories) {
      for (let i = 1; i <= 5; i++) {
        rooms.push({
          dormitory_id: dormitory.id,
          room_number: `${dormitory.id}-${String(i).padStart(3, "0")}`, // Format: dormId-001
          capacity: Math.floor(Math.random() * 3) + 2, // Random capacity between 2-4
          current_occupancy: 0, // Start with empty rooms
          room_type: roomTypes[Math.floor(Math.random() * roomTypes.length)],
          status: statusTypes[Math.floor(Math.random() * statusTypes.length)],
          created_by: 1, // Default admin user
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert("Room", rooms, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Room", null, {});
  },
};
