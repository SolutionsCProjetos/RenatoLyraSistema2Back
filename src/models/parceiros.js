module.exports = (sequelize, DataTypes) => {
    const Parceiros = sequelize.define(
      "parceiros",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        status: {
          type: DataTypes.ENUM("Ativo", "Desativado"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["Ativo", "Desativado"]],
              msg: "Revise o Status",
            },
          },
        },
        senha: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
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
        obsEnd: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        rule: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 2,
        },
        obs: {
          type: DataTypes.STRING(300),
          allowNull: true,
        },
        tipoId: {
          type: DataTypes.INTEGER,
          references: {
            model: "tipo", // Deve corresponder ao nome da tabela no banco de dados
            key: "id",
          },
          allowNull: true,
        },
      },
      {
        freezeTableName: true,
      }
    );

    Parceiros.associate = (models) => {
      // Associação  entre Parceiros e Setores
      Parceiros.belongsTo(models.tipo, {
        foreignKey: "tipoId",
        as: "tipos",
      });
    };
  
    return Parceiros;
  };
  