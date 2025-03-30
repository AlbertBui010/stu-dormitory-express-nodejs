"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const students = [
      {
        id: "ADMIN",
        name: "John Doe",
        role: "student",
        email: "john.doe@example.com",
        phone: 123456789,
        gender: "Male",
        dob: "2000-01-01",
        major: "Computer Science",
        year: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "ST002",
        name: "Jane Smith",
        role: "student",
        email: "jane.smith@example.com",
        phone: 987654321,
        gender: "Female",
        dob: "2001-02-15",
        major: "Engineering",
        year: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "AD001",
        name: "Admin User",
        role: "admin",
        email: "admin@example.com",
        phone: 111222333,
        gender: "Other",
        dob: "1990-03-20",
        major: "Administration",
        year: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Student", students, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Student", null, {});
  },
};
