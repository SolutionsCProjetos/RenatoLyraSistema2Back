'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('petVacinas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      petId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "pets",
          key: "id",
        },
      },
      vacinaId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "vacinas",
          key: "id",
        },
      },
      vacinasAplicadas: {
        type: Sequelize.JSON, // Armazena um array de strings
        allowNull: true,
        defaultValue: [],
      },
      dataUltimaVacinacao: {
        type: Sequelize.DATE, // Última data de vacinação
        allowNull: true,
      },
      historicoMedico: {
        type: Sequelize.JSON, // Histórico de registros médicos em formato JSON
        allowNull: true,
        defaultValue: [],
      },
      alergias: {
        type: Sequelize.STRING(200), // Lista de alergias como string separada por vírgulas
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('petVacinas');
  }
};
