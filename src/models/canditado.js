module.exports = (sequelize, DataTypes) => {
  const Canditado = sequelize.define(
    "candidatos",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      nome: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Precisa ser informado um nome.",
          },
        },
      },
      rg: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      cpf: {
        type: DataTypes.STRING(14),
        allowNull: true,
        validate: {
          is: {
            args: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
            msg: "CPF deve estar no formato 000.000.000-00.",
          },
        },
      },
      cnh: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      categoria: {
        type: DataTypes.ENUM(
          "A",
          "AB",
          "B",
          "AC",
          "C",
          "AD",
          "D",
          "AE",
          "E",
          "NaoTem'"
        ),
        allowNull: true,
        validate: {
          isIn: {
            args: [["A", "AB", "B", "AC", "C", "AD", "D", "AE", "E", "NaoTem"]],
            msg: "Categoria deve ser uma das opções válidas.",
          },
        },
      },
      tituloEleitor: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      zonaEleitoral: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      cidadeEleitoral: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      secao: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      dependentes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      areaAtuacao: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      areaAtuacao2: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      areaAtuacao3: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      areaAtuacao4: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      areaAtuacao5: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      estCivil: {
        type: DataTypes.ENUM(
          "Solteiro",
          "Casado",
          "Viúvo",
          "Divorciado",
          "Separado juridicamente"
        ),
        allowNull: true,
        validate: {
          isIn: {
            args: [
              [
                "Solteiro",
                "Casado",
                "Viúvo",
                "Divorciado",
                "Separado juridicamente",
              ],
            ],
            msg: "Estado civil deve ser uma das opções válidas.",
          },
        },
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
          isEmail: {
            msg: "O email deve ter um formato válido.",
          },
        },
      },
      dataNascimento: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      contato: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      telefone2: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      cep: {
        type: DataTypes.STRING(10),
        allowNull: true,
        validate: {
          is: {
            args: /^[0-9]{5}-[0-9]{3}$/,
            msg: "CEP deve estar no formato 00000-000.",
          },
        },
      },
      endereco: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      numero: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      bairro: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      uf: {
        type: DataTypes.STRING(2),
        allowNull: true,
      },
      cidade: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      pontoReferencia: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("Trabalhando", "Disponivel"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["Trabalhando", "Disponivel"]],
            msg: "Status deve ser 'Trabalhando' ou 'Disponivel'.",
          },
        },
      },
      departamento: {
        type: DataTypes.ENUM("Privado", "Publico"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["Privado", "Publico"]],
            msg: "Status deve ser 'Privado' ou 'Publico'.",
          },
        },
      },
      obs: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      documentos: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
    }
  );
  
  Canditado.associate = (models) => {
    Canditado.hasMany(models.historicoEmpresa, {
      foreignKey: "empregoId",
      as: "historico",
    });
  };


  return Canditado;
};
