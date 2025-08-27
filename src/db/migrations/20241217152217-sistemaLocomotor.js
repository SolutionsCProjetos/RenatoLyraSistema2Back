'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sistemaLocomotor', {
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
      claudicacao: {
        type: Sequelize.STRING(150),
        allowNull: true,
        validate: {
          len: {
            args: [0, 150],
            msg: "A cladicação deve ter no máximo 150 caracteres.",
          },
          isAlpha: {
            msg: "A cladicação deve conter apenas letras.",
          },
        },
      },
      dorTransporObstaculos: {
        type: Sequelize.STRING(150),
        allowNull: true,
        validate: {
          len: {
            args: [0, 150],
            msg: "A dor ao transpor obstaculos deve ter no máximo 150 caracteres.",
          },
        },
      },
      paresia: {
        type: Sequelize.STRING(150),
        allowNull: true,
        validate: {
          len: {
            args: [0, 150],
            msg: "A paresia deve ter no máximo 150 caracteres.",
          },
          isAlpha: {
            msg: "A paresia deve conter apenas letras.",
          },
        },
      },
      impoteciaFuncional: {
        type: Sequelize.STRING(150),
        allowNull: true,
        validate: {
          len: {
            args: [0, 150],
            msg: "A Impotência funcional deve ter no máximo 150 caracteres.",
          },
          isAlpha: {
            msg: "A Impotência funcional deve conter apenas letras.",
          },
        },
      },
      inflamacao: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      edema: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      deformidade: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      restricaoMovimento: {
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
    await queryInterface.dropTable('sistemaLocomotor');
  }
};
