module.exports = (sequelize, DataTypes) => {
  const ContasApagar = sequelize.define(
    "contasapagar",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      cnpj: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      fornecedor: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Informe o fornecedor!",
          },
        },
      },
      historico: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      situacao: {
        type: DataTypes.ENUM("Paga", "Aberta", "Pago parcial", "Atrasado"),
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
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O vencimento precisa ser inserido!",
          },
        },
      },
      dataPagamento: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      valorTotal: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      parcelas: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
      juros: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      desconto: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      valorPago: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      valorEmAberto: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      empresa: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      categoria: {
        type: DataTypes.STRING(150),
        allowNull: false,
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
    },
    {
      freezeTableName: true,
    }
  );

  return ContasApagar;
}