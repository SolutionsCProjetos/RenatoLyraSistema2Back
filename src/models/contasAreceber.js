module.exports = (sequelize, DataTypes) => {
  const ContasReceber = sequelize.define(
    "contasreceber",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      status: {
        type: DataTypes.ENUM("Aberto", "Fechado", "Parcial", "Atrasado"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["Aberto", "Fechado", "Parcial", "Atrasado"]],
            msg: "O status deve ser 'A' (aberto), 'F' (fechado) ou 'P' (Parcial)",
          },
        },
      },
      clienteId: {
        type: DataTypes.INTEGER,
        references: {
          model: "cliente", // Nome do modelo Cliente
          key: "id",        // Chave primária de Cliente
        },
        allowNull: false, // Cliente é obrigatório
      },
      vencimento: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O vencimento precisa ser inserido!",
          },
        },
      },
      valorReceber: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O valor a receber precisa ser inserido!",
          },
        },
      },
      parcelas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "As parcelas precisam ser inseridas!",
          },
        },
      },
      formaPagamento: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "null",
      },
      dataReceber: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      pagamentoParcial: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      valorPago: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      juros: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      multa: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      custos: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      descontos: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      valorEmAberto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      cpfCnpj: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      recibo: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      obs: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      empresa: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      categoria: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
    }
  );

  ContasReceber.associate = (models) => {
    ContasReceber.belongsTo(models.cliente, {
      foreignKey: "clienteId",
      as: "cliente", // Nome do alias para facilitar consultas
    });
  };
  
  return ContasReceber;
};
