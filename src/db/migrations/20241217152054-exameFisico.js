'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("exameFisico", {
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
      frequenciaCardiaca: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      frequenciaRespiratoria: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      temperatura: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      tempoPreenchimentoCapilar: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      mucosas: {
        type: Sequelize.ENUM(
          "Normal",
          "Cianotica",
          "Hipocorada",
          "Icteria",
          "Perlacia"
        ),
        allowNull: false,
        validate: {
          isIn: {
            args: [
              ["Normal", "Cianotica", "Hipocorada", "Icteria", "Perlacia"],
            ],
            msg: "O valor deve ser um dos seguintes: Normal, Cianótica, Hipocorada, Ictéria, Perlacia.",
          },
        },
      },
      desidratacao: {
        type: Sequelize.ENUM("Hidratado", "Leve", "Moderado", "Grave"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["Hidratado", "Leve", "Moderado", "Grave"]],
            msg: "O valor deve ser um dos seguintes: Hidratado, Leve, Moderado, Grave.",
          },
        },
      },
      estadoCorporal: {
        type: Sequelize.ENUM(
          "Caquético",
          "Magro",
          "Ideal",
          "Sobrepeso",
          "Obeso"
        ),
        allowNull: true,
      },
      linfonodos: {
        type: Sequelize.TEXT,
        allowNull: true, 
      },
      linfonodosObs: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      observacoesRespiratorias: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      pressaoArterial: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable('exameFisico');
  }
};
