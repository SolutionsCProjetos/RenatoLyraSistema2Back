'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.createTable("tipo", {
       id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
       },
       comercio: {
         type: Sequelize.STRING(50),
         allowNull: true,
       },
       createdAt: {
         type: Sequelize.DATE,
         allowNull: false,
         defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
       },
       updatedAt: {
         type: Sequelize.DATE,
         allowNull: false,
         defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
       },
     });

     return queryInterface.bulkInsert("tipo", [
       {
         comercio: "PetShop",
         createdAt: new Date(),
         updatedAt: new Date(),
       },
       {
         comercio: "Clinica veterinaria",
         createdAt: new Date(),
         updatedAt: new Date(),
       },
     ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("tipo");
  }
};
