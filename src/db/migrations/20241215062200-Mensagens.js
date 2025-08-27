'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mensagens', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      titulo: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      dias_relativos: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      mensagem: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      antes_ou_depois: {
        type: Sequelize.ENUM("antes", "depois"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["antes", "depois"]],
            msg: "Verificar o antes ou depois",
          },
        },
      },
      tipo: {
        type: Sequelize.ENUM("lembrete", "cobrança"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["lembrete", "cobrança"]],
            msg: "Verificar o antes ou depois",
          },
        },
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
    await queryInterface.dropTable('mensagens');
  }
};
