'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("solicitantes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      solicitante: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      nomeCompleto: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      cpf: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      titulo: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      telefoneContato: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      telefoneContato2: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      secaoEleitoral: {
        type: Sequelize.STRING(45),
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("solicitantes");
  }
};
