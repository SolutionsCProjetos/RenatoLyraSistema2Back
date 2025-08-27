'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sistemaTegumentar', {
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
      prurido: {
        type: Sequelize.STRING(320),
        allowNull: true,
        validate: {
          len: {
            args: [0, 320],
            msg: "O prurido devem ter no máximo 320 caracteres.",
          },
        },
      },
      alopecia: {
        type: Sequelize.STRING(320),
        allowNull: true,
        validate: {
          len: {
            args: [0, 320],
            msg: "A alopecia deve ter no máximo 320 caracteres.",
          },
        },
      },
      descamacao: {
        type: Sequelize.STRING(320),
        allowNull: true,
        validate: {
          len: {
            args: [0, 320],
            msg: "A descamação deve ter no máximo 320 caracteres.",
          },
        },
      },
      meneiosCefalicos: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      secrecaoOtologica: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      puliciose: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      infestacaoCarrapatos: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      hiperqueratose: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      pustulas: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      eritema: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      edema: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      nodulosOuMassas: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      corTexturaPelo: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('sistemaTegumentar');
  }
};
