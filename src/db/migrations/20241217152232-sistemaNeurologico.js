'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sistemaNeurologico', {
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
      convulsoes: {
        type: Sequelize.STRING(150),
        allowNull: true,
        validate: {
          len: {
            args: [0, 150],
            msg: "As convulsões devem ter no máximo 150 caracteres.",
          },
        },
      },
      alteracaoComportamental: {
        type: Sequelize.STRING(150),
        allowNull: true,
        validate: {
          len: {
            args: [0, 150],
            msg: "A alteração comportamental deve ter no máximo 150 caracteres.",
          },
        },
      },
      andarEmCirculo: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      headTilt: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      nistagmo: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      paralisia: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      tremores: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      ataxia: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      reflexosAlterados: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      descricaoGeral: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('sistemaNeurologico');
  }
};
