'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sistemaGastro', {
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
      apetite: {
        type: Sequelize.ENUM("Normorexia", "Anorexia", "Hipofagia", "Polifagia"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["Normorexia", "Anorexia", "Hipofagia", "Polifagia"]],
            msg: "O valor deve ser um dos seguintes: Normorexia, Anorexia, Hipofagia, Polifagia.",
          },
        },
      },
      frequencia: {
        type: Sequelize.STRING(300),
        allowNull: true,
        validate: {
          len: {
            args: [0, 300],
            msg: "A frequencia deve ter no máximo 300 caracteres.",
          },
        },
      },
      coloracao: {
        type: Sequelize.STRING(300),
        allowNull: true,
        validate: {
          len: {
            args: [0, 300],
            msg: "A coloração deve ter no máximo 300 caracteres.",
          },
        },
      },
      hematemese: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      diarreia: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      melena: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      hematoquesia: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      disquesia: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      tenesmo: {
        type: Sequelize.BOOLEAN(),
        allowNull: true,
      },
      aquesia: {
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
    await queryInterface.dropTable('sistemaGastro');
  }
};
