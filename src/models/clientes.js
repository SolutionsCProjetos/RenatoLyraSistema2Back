module.exports = (sequelize, DataTypes) => {
  const Clientes = sequelize.define(
    "cliente",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      status: {
        type: DataTypes.ENUM("Ativo", "Inativo"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["Ativo", "Inativo" ]],
            msg: "Revise o Status",
          },
        },
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      indicacao: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      contato: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      cnpj: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      cpf: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      razaoSocial: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Precisa ser informado uma razão social",
          },
        },
      },
      fantasia: {
        type: DataTypes.STRING(60),
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
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      uf: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      cidade: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      pontoReferencia: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      telefone_2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      situacao: {
        type: DataTypes.ENUM("Liberado", "Bloqueado"),
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
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      prioridade: {
        type: DataTypes.ENUM("Alta", "Normal", "Baixa"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["Alta", "Normal", "Baixa"]],
            msg: "Revise a prioridade",
          },
        },
      },
    },
    {
      freezeTableName: true,
    }
  );

  return Clientes;
};
