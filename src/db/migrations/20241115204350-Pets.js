'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nomePet: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      clienteId: {
        type: Sequelize.INTEGER,
        references: {
          model: "cliente",
          key: "id",
        },
        allowNull: false,
      },
      raca: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      dataNascimento: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      especie: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      pelagem: {
        type: Sequelize.ENUM("PELO CURTO", "PELO MEDIO", "PELO LONGO"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["PELO CURTO", "PELO MEDIO", "PELO LONGO"]],
            msg: "Revise a pelagem",
          },
        },
      },
      corPelo: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      sexo: {
        type: Sequelize.ENUM("MACHO", "FÊMEA"),
        allowNull: false,
      },
      numeroChip: {
        type: Sequelize.BIGINT,
        allowNull: true,
        unique: true, // Evita duplicação de chips
        validate: {
            isNumeric: {
                msg: "O número do chip deve conter apenas números",
            },
        },
    },
      porte: {
        type: Sequelize.ENUM("PEQUENO", "MEDIO", "GRANDE"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["PEQUENO", "MEDIO", "GRANDE"]],
            msg: "Revise o porte",
          },
        },
      },
      situacao: {
        type: Sequelize.ENUM("VIVO", "MORTO"),
        allowNull: false,
        defaultValue: "VIVO",
        validate: {
          isIn: {
            args: [["VIVO", "MORTO"]],
            msg: "Revise a situação",
          },
        },
      },
      pesoAtual: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      obs: {
        type: Sequelize.STRING(300),
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
    await queryInterface.dropTable('pets');
  }
};
