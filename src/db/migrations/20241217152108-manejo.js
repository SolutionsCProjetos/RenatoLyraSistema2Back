'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('manejo', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      petId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "pets",
          key: "id",
        },
      },
      parceiroId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "parceiros",
          key: "id",
        },
      },
      alimentacao: {
        type: Sequelize.STRING(300),
        allowNull: true,
        validate: {
          len: {
            args: [0, 300],
            msg: "A alimentação deve ter no máximo 300 caracteres.",
          },
        },
      },
      tipoAlimentacao: {
        type: Sequelize.ENUM("Ração", "Comida Natural", "Ambos", "Outro"),
        allowNull: true,
      },
      horariosAlimentacao: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      acessoAguaFresca: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      ambiente: {
        type: Sequelize.ENUM("Interno", "Externo", "Ambos"),
        allowNull: true,
      },
      atividadeFisica: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      contatoComOutrosAnimais: {
        type: Sequelize.ENUM("Nenhum", "Pouco", "Frequentemente"),
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
    await queryInterface.dropTable('manejo');
  }
};
