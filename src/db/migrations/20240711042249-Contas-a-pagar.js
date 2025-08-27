'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("contasapagar", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      cnpj: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      fornecedor: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Informe o fornecedor!",
          },
        },
      },
      historico: {
        type: Sequelize.STRING(60),
        allowNull: true,
      },
      situacao: {
        type: Sequelize.ENUM("Paga", "Aberta", "Pago parcial", "Atrasado"),
        allowNull: false,
        defaultValue: "Aberta",
        validate: {
          isIn: {
            args: [["Paga", "Aberta", "Pago parcial", "Atrasado"]],
            msg: "Precisa ser informado uma situação para o contas a receber!",
          },
        },
      },
      vencimento: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O vencimento precisa ser inserido!",
          },
        },
      },
      dataPagamento: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      valorTotal: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      parcelas: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
      juros: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      desconto: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      valorPago: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      valorEmAberto: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      empresa: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      categoria: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      recibo: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      obs: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
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
    await queryInterface.dropTable("ContasApagar");
  },
};
