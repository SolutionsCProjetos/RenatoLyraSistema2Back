'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sistemaCardio", {
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
      parceiroId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "parceiros",
          key: "id",
        },
      },
      secrecao: {
        type: Sequelize.ENUM("Nasal", "Ocular", "Nasal e Ocular", "Nenhuma"),
        allowNull: true,
        validate: {
          isIn: {
            args: [["Nasal", "Ocular", "Nasal e Ocular"]],
            msg: "O valor deve ser um dos seguintes: Nasal, Ocular, Nenhuma, Nasal e Ocular",
          },
        },
      },
      descricao: {
        type: Sequelize.STRING(300),
        allowNull: true,
        validate: {
          len: {
            args: [0, 300],
            msg: "A descrição deve ter no máximo 300 caracteres.",
          },
        },
      },
      sincope: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      tosse: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      espirro: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      districao_resp: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      cianose: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      intolerancia_exer: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      cansacoFacil: {
        type: Sequelize.BOOLEAN(),
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
    await queryInterface.dropTable('sistemaCardio');
  }
};
