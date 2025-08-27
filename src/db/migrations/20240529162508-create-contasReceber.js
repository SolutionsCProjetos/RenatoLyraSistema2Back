'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("contasreceber", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      status: {
        type: Sequelize.ENUM("Aberto", "Fechado", "Parcial", "Atrasado"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["Aberto", "Fechado", "Parcial", "Atrasado"]],
            msg: "O status deve ser 'A' (aberto), 'F' (fechado) ou 'P' (Parcial)",
          },
        },
      },
      clienteId: {
        type: Sequelize.INTEGER,
        references: {
          model: "cliente", // Nome do modelo Cliente
          key: "id",        // Chave primária de Cliente
        },
        allowNull: false, // Cliente é obrigatório
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
      valorReceber: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O valor a receber precisa ser inserido!",
          },
        },
      },
      parcelas: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "As parcelas precisam ser inseridas!",
          },
        },
      },
      formaPagamento: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "null",
      },
      dataReceber: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      pagamentoParcial: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      valorPago: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      juros: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      multa: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      custos: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      descontos: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      valorEmAberto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      cpfCnpj: {
        type: Sequelize.STRING(30),
        allowNull: true,
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
      empresa: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      categoria: {
        type: Sequelize.STRING(150),
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
    await queryInterface.dropTable("contasreceber");
  }
};
