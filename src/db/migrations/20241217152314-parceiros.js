'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("parceiros", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("Ativo", "Desativado"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["Ativo", "Desativado"]],
            msg: "Revise o Status",
          },
        },
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      contato: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      cnpj: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      cpf: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      razaoSocial: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Precisa ser informado uma razão social",
          },
        },
      },
      fantasia: {
        type: Sequelize.STRING(60),
        allowNull: true,
      },
      cep: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      endereco: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      num: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      bairro: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      uf: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      cidade: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      pontoReferencia: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      telefone_2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      obsEnd: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      obs: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      rule: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2,
      },
      tipoId: {
        type: Sequelize.INTEGER,
        references: {
          model: "tipo", // Deve corresponder ao nome da tabela no banco de dados
          key: "id",
        },
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
    await queryInterface.dropTable('parceiros');
  }
};
