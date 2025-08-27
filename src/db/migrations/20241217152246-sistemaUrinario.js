"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("sistemaUrinario", {
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
      disfuncaoHidrica: {
        type: Sequelize.ENUM(
          "Normodipsia",
          "Adepsia",
          "Polidipsia",
          "Oligodipsia"
        ),
        allowNull: true,
        validate: {
          isIn: {
            args: [["Normodipsia", "Adepsia", "Polidipsia", "Oligodipsia"]],
            msg: "O valor deve ser um dos seguintes: Normodipsia, Adepsia, Polidipsia, Oligodipsia",
          },
        },
      },
      crias: {
        type: Sequelize.ENUM("Nulipara", "Primipara", "Pluripara", "Nenhuma"),
        allowNull: true,
        validate: {
          isIn: {
            args: [["Nulipara", "Primipara", "Pluripara", "Nenhuma"]],
            msg: "O valor deve ser um dos seguintes: Nulipara, Primipara, Pluripara e Nenhuma",
          },
        },
      },
      coloracao: {
        type: Sequelize.STRING(50),
        allowNull: true,
        validate: {
          len: {
            args: [0, 50],
            msg: "A coloração deve ter no máximo 50 caracteres.",
          },
          isAlpha: {
            msg: "A coloração deve conter apenas letras.",
          },
        },
      },
      volume: {
        type: Sequelize.STRING(50),
        allowNull: true,
        validate: {
          len: {
            args: [0, 50],
            msg: "O volume deve ter no máximo 50 caracteres.",
          },
        },
      },
      frequencia: {
        type: Sequelize.STRING(50),
        allowNull: true,
        validate: {
          len: {
            args: [0, 50],
            msg: "A frequência deve ter no máximo 50 caracteres.",
          },
        },
      },
      odor: {
        type: Sequelize.STRING(50),
        allowNull: true,
        validate: {
          len: {
            args: [0, 50],
            msg: "O odor deve ter no máximo 50 caracteres.",
          },
          isAlpha: {
            msg: "O odor deve conter apenas letras.",
          },
        },
      },
      hematuria: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      disuria: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      cristaluria: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      bacteriuria: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      piuria: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      estranguria: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      secrecao: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      castrado: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      partosNormais: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      anticoncepcional: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      cioRegular: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      outrasAlteracoes: {
        type: Sequelize.STRING(300),
        allowNull: true,
        validate: {
          len: {
            args: [0, 300],
            msg: "O outras alterações deve ter no máximo 300 caracteres.",
          },
        },
      },
      observacoesGerais: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ultimoCio: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("sistemaUrinario");
  },
};
