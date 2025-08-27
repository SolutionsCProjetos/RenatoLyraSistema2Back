'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("operacoes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          "Finalizado",
          "Aberto",
          "Cancelado",
          "Andamento",
          "Atrasado"
        ),
        allowNull: false,
        defaultValue: "Aberto",
        validate: {
          isIn: {
            args: [
              ["Finalizado", "Aberto", "Cancelado", "Andamento", "Atrasado"],
            ],
            msg: "Precisa ser informado um status!",
          },
        },
      },
      motivo: {
        type: Sequelize.ENUM("Sem exito", "Sem Perfil", "Pausado"),
        allowNull: true,
        defaultValue: null,
      },
      atividade: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Atividade não pode ser vazia.",
          },
        },
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      closingDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      valorOperacao: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "usuarios",
          key: "id",
        },
        allowNull: false,
      },
      clienteId: {
        type: Sequelize.INTEGER,
        references: {
          model: "cliente",
          key: "id",
        },
        allowNull: true,
      },
      obs: {
        type: Sequelize.STRING(300),
        allowNull: true,
        defaultValue: null,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('operacoes');
  }
};
