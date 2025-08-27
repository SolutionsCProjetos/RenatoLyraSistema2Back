module.exports = (sequelize, DataTypes) => {
    const ExameFisico = sequelize.define(
      "exameFisico",
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
        frequenciaCardiaca: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        frequenciaRespiratoria: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        temperatura: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        tempoPreenchimentoCapilar: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        mucosas: {
          type: DataTypes.ENUM(
            "Normal",
            "Cianotica",
            "Hipocorada",
            "Icteria",
            "Perlacia"
          ),
          allowNull: false,
          validate: {
            isIn: {
              args: [
                ["Normal", "Cianotica", "Hipocorada", "Icteria", "Perlacia"],
              ],
              msg: "O valor deve ser um dos seguintes: Normal, Cianótica, Hipocorada, Ictéria, Perlacia.",
            },
          },
        },
        desidratacao: {
          type: DataTypes.ENUM("Hidratado", "Leve", "Moderado", "Grave"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["Hidratado", "Leve", "Moderado", "Grave"]],
              msg: "O valor deve ser um dos seguintes: Hidratado, Leve, Moderado, Grave.",
            },
          },
        },
        estadoCorporal: {
          type: DataTypes.ENUM(
            "Caquético",
            "Magro",
            "Ideal",
            "Sobrepeso",
            "Obeso"
          ),
          allowNull: true,
        },
        linfonodos: {
          type: DataTypes.TEXT,
          allowNull: true, // Exemplo: ["SubMandibulares", "Axilares"]
        },
        linfonodosObs: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        observacoesRespiratorias: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        pressaoArterial: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        descricaoGeral: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        tableName: "exameFisico",
      }
    );

    ExameFisico.associate = (models) => {
        ExameFisico.belongsTo(models.pets, {
            foreignKey: "petId",
            as: "pet",
        });
        ExameFisico.belongsTo(models.parceiros, {
            foreignKey: "parceiroId",
            as: "parceiro",
        });
    }
    return ExameFisico;
}