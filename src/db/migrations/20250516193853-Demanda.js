'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("demandas", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      protocolo: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      setor: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      prioridade: {
        type: Sequelize.ENUM("P0", "P1", "P2", "P3"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["P0", "P1", "P2", "P3"]],
            msg: "Revise a prioridade",
          },
        },
      },
      status: {
        type: Sequelize.ENUM(
          "Pendente",
          "Aguardando Retorno",
          "Cancelada",
          "Concluída"
        ),
        allowNull: false,
        validate: {
          isIn: {
            args: [
              ["Pendente", "Aguardando Retorno", "Cancelada", "Concluída"],
            ],
            msg: "Revise o Status",
          },
        },
      },
      dataSolicitacao: {
        type: Sequelize.DATE, // Última data de vacinação
        allowNull: false,
      },
      dataTermino: {
        type: Sequelize.DATE, // Última data de vacinação
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
      bairro: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      num: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      zona: {
        type: Sequelize.STRING(35),
        allowNull: true,
      },
      pontoReferencia: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reincidencia: {
        type: Sequelize.ENUM("Sim", "Não"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["Sim", "Não"]],
            msg: "Revise a reincidência",
          },
        },
      },
      meioSolicitacao: {
        type: Sequelize.ENUM("WhatsApp", "Não"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["WhatsApp", "Não"]],
            msg: "Revise o meio de solicitacao",
          },
        },
      },
      solicitanteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "solicitantes", // Nome da tabela referenciada
          key: "id", // Nome da coluna referenciada
        },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT",
      },
      anexarDocumentos: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      envioCobranca1: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      envioCobranca2: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      envioParaResponsavel: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      observacoes: {
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
    await queryInterface.dropTable("demandas");
  }
};
