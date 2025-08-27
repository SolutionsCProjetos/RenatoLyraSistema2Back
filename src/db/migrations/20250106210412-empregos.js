'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("candidatos", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      nome: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Precisa ser informado um nome.",
          },
        },
      },
      rg: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      cpf: {
        type: Sequelize.STRING(14),
        allowNull: true,
        validate: {
          is: {
            args: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
            msg: "CPF deve estar no formato 000.000.000-00.",
          },
        },
      },
      cnh: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      categoria: {
        type: Sequelize.ENUM(
          "A",
          "AB",
          "B",
          "AC",
          "C",
          "AD",
          "D",
          "AE",
          "E",
          "NaoTem"
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
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      zonaEleitoral: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      cidadeEleitoral: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      secao: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      dependentes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      areaAtuacao: {
        type: Sequelize.STRING(50),
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
        type: Sequelize.ENUM(
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
        type: Sequelize.STRING(50),
        allowNull: true,
        validate: {
          isEmail: {
            msg: "O email deve ter um formato válido.",
          },
        },
      },
      dataNascimento: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      contato: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      telefone2: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      cep: {
        type: Sequelize.STRING(10),
        allowNull: true,
        validate: {
          is: {
            args: /^[0-9]{5}-[0-9]{3}$/,
            msg: "CEP deve estar no formato 00000-000.",
          },
        },
      },
      endereco: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      numero: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      bairro: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      uf: {
        type: Sequelize.STRING(2),
        allowNull: true,
      },
      cidade: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      pontoReferencia: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("Trabalhando", "Disponivel"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["Trabalhando", "Disponivel"]],
            msg: "Status deve ser 'Trabalhando' ou 'Disponivel'.",
          },
        },
      },
      departamento: {
        type: Sequelize.ENUM("Privado", "Publico"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["Privado", "Publico"]],
            msg: "Status deve ser 'Privado' ou 'Publico'.",
          },
        },
      },
      expProfissional: {
        type: Sequelize.STRING(400),
        allowNull: true,
      },
      obs: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      documentos: {
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
    await queryInterface.dropTable("candidatos");
  }
};
