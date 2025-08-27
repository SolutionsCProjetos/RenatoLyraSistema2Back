module.exports = (sequelize, DataTypes) => {
    const SistemaUrinario = sequelize.define(
      "sistemaUrinario",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        petId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "pets",
            key: "id",
          },
        },
        parceiroId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "parceiros",
            key: "id",
          },
        },
        disfuncaoHidrica: {
          type: DataTypes.ENUM(
            "Normodipsia",
            "Adepsia",
            "Polidipsia",
            "Oligodipsia"
          ),
          allowNull: true,
          validate: {
            isIn: {
              args: [["Normodipsia", "Adepsia", "Polidipsia", "Oligodipsia"]],
              msg: "O valor deve ser um dos seguintes: Normodipsia, Adepsia, Polidipsia e Oligodipsia",
            },
          },
        },
        crias: {
          type: DataTypes.ENUM("Nulipara", "Primipara", "Pluripara", "Nenhuma"),
          allowNull: true,
          validate: {
            isIn: {
              args: [["Nulipara", "Primipara", "Pluripara", "Nenhuma"]],
              msg: "O valor deve ser um dos seguintes: Nulipara, Primipara e Pluripara",
            },
          },
        },
        coloracao: {
          type: DataTypes.STRING(50),
          allowNull: true,
          validate: {
            len: {
              args: [0, 50],
              msg: "A coloração deve ter no máximo 50 caracteres.",
            },
            isAlpha: {
              msg: "A coloração deve conter apenas letras.",
            },
          },
        },
        frequencia: {
          type: DataTypes.STRING(50),
          allowNull: true,
          validate: {
            len: {
              args: [0, 50],
              msg: "A frequência deve ter no máximo 50 caracteres.",
            },
          },
        },
        volume: {
          type: DataTypes.STRING(50),
          allowNull: true,
          validate: {
            len: {
              args: [0, 50],
              msg: "O volume deve ter no máximo 50 caracteres.",
            },
          },
        },
        odor: {
          type: DataTypes.STRING(50),
          allowNull: true,
          validate: {
            len: {
              args: [0, 50],
              msg: "O odor deve ter no máximo 50 caracteres.",
            },
            isAlpha: {
              msg: "O odor deve conter apenas letras.",
            },
          },
        },
        hematuria: {
          type: DataTypes.BOOLEAN(),
          allowNull: true,
        },
        disuria: {
          type: DataTypes.BOOLEAN(),
          allowNull: true,
        },
        cristaluria: {
          type: DataTypes.BOOLEAN(),
          allowNull: true,
        },
        bacteriuria: {
          type: DataTypes.BOOLEAN(),
          allowNull: true,
        },
        piuria: {
          type: DataTypes.BOOLEAN(),
          allowNull: true,
        },
        estranguria: {
          type: DataTypes.BOOLEAN(),
          allowNull: true,
        },
        secrecao: {
          type: DataTypes.BOOLEAN(),
          allowNull: true,
        },
        castrado: {
          type: DataTypes.BOOLEAN(),
          allowNull: true,
        },
        partosNormais: {
          type: DataTypes.BOOLEAN(),
          allowNull: true,
        },
        anticoncepcional: {
          type: DataTypes.BOOLEAN(),
          allowNull: true,
        },
        cioRegular: {
          type: DataTypes.BOOLEAN(),
          allowNull: true,
        },
        outrasAlteracoes: {
          type: DataTypes.STRING(300),
          allowNull: true,
          validate: {
            len: {
              args: [0, 300],
              msg: "O outras alterações deve ter no máximo 250 caracteres.",
            },
          },
        },
        observacoesGerais: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        ultimoCio: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        tableName: "sistemaUrinario",
      }
    );
    
    SistemaUrinario.associate = (models) => {
        SistemaUrinario.belongsTo(models.pets, {
            foreignKey: "petId",
            as: "pet",
        });
        SistemaUrinario.belongsTo(models.parceiros, {
            foreignKey: "parceiroId",
            as: "parceiro",
        });
    }
    return SistemaUrinario;
}