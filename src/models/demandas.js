module.exports = (sequelize, DataTypes) => {
  const Demandas = sequelize.define(
    "demandas",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      protocolo: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      solicitant: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      setor: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      solicitanteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "solicitantes", // Nome da tabela referenciada
          key: "id", // Nome da coluna referenciada
        },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT",
      },
      prioridade: {
        type: DataTypes.ENUM("P0", "P1", "P2", "P3"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["P0", "P1", "P2", "P3"]],
            msg: "Revise a prioridade",
          },
        },
      },
      status: {
        type: DataTypes.ENUM(
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
        type: DataTypes.DATE, // Última data de vacinação
        allowNull: false,
      },
      dataTermino: {
        type: DataTypes.DATE, // Última data de vacinação
        allowNull: true,
      },
      cep: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      endereco: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      num: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      bairro: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      zona: {
        type: DataTypes.STRING(35),
        allowNull: true,
      },
      pontoReferencia: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      observacoes: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      reincidencia: {
        type: DataTypes.ENUM("Sim", "Não"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["Sim", "Não"]],
            msg: "Revise a reincidência",
          },
        },
      },
      meioSolicitacao: {
        type: DataTypes.ENUM("WhatsApp", "Não"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["WhatsApp", "Não"]],
            msg: "Revise o meio de solicitacao",
          },
        },
      },
      anexarDocumentos: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      envioCobranca1: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      envioCobranca2: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      envioParaResponsavel: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
    }
  );

  Demandas.associate = (models) => {
    Demandas.belongsTo(models.solicitantes, {
      foreignKey: "solicitanteId",
      as: "solicitante",
    });
  };
  return Demandas;
};
