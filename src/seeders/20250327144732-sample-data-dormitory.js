"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Dormitory",
      [
        {
          name: "Building A",
          address: "123 University Street, Campus Zone 1",
          total_rooms: 100,
          created_by: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Building B",
          address: "456 College Road, Campus Zone 2",
          total_rooms: 150,
          created_by: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Building C",
          address: "789 Student Avenue, Campus Zone 3",
          total_rooms: 80,
          created_by: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Dormitory", null, {});
  },
};
