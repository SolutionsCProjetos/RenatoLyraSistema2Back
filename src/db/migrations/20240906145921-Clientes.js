'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("cliente", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      status: {
        type: Sequelize.ENUM("Ativo", "Inativo"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["Ativo", "Inativo" ]],
            msg: "Revise o Status",
          },
        },
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      indicacao: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      contato: {
        type: Sequelize.STRING(20),
        allowNull: true
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
          msg: "Precisa ser informado uma razão social",
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
      contador: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      situacao: {
        type: Sequelize.ENUM("Liberado", "Bloqueado"),
        allowNull: false,
        defaultValue: "Liberado",
        validate: {
          isIn: {
            args: [["Liberado", "Bloqueado"]],
            msg: "Revise a situação",
          },
        },
      },
      obs: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      prioridade: {
        type: Sequelize.ENUM("Alta", "Normal", "Baixa"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["Alta", "Normal", "Baixa"]],
            msg: "Revise a prioridade",
          },
        },
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
    await queryInterface.dropTable('cliente');
  }
};
