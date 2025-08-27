module.exports = (sequelize, DataTypes) => {
  const Operacao = sequelize.define(
    "operacoes",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
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
        type: DataTypes.ENUM("Sem exito", "Sem Perfil", "Pausado"),
        allowNull: true,
        defaultValue: null,
      },
      atividade: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Atividade não pode ser vazia.",
          },
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      closingDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      valorOperacao: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "usuarios",
          key: "id",
        },
        allowNull: false,
      },
      clienteId: {
        type: DataTypes.INTEGER,
        references: {
          model: "cliente",
          key: "id",
        },
        allowNull: true,
      },
      obs: {
        type: DataTypes.STRING(300),
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "operacoes",
    }
  );

  Operacao.associate = (models) => {
    Operacao.belongsTo(models.usuarios, {
      foreignKey: "userId",
      as: "usuario",
    });

    Operacao.belongsTo(models.cliente, {
      foreignKey: "clienteId",
      as: "cliente",
    });
  };

  return Operacao;
};
