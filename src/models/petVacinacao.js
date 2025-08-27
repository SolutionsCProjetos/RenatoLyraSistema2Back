module.exports = (sequelize, DataTypes) => {
    const PetVacinas = sequelize.define(
      "petVacinas",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        petId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "pets",
            key: "id",
          },
          onDelete: "CASCADE", // Adiciona a exclusão em cascata
        },
        vacinaId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "vacinas",
            key: "id",
          },
        },
        vacinasAplicadas: {
          type: DataTypes.JSON, // Armazena um array de strings
          allowNull: true,
          defaultValue: [],
        },
        dataUltimaVacinacao: {
          type: DataTypes.DATE, // Última data de vacinação
          allowNull: true,
        },
        historicoMedico: {
          type: DataTypes.JSON, // Histórico de registros médicos em formato JSON
          allowNull: true,
          defaultValue: [],
        },
        alergias: {
          type: DataTypes.STRING(200), // Lista de alergias como string separada por vírgulas
          allowNull: true,
        },
      },
      {
        tableName: "petVacinas",
        timestamps: false,
      }
    );
  
    PetVacinas.associate = (models) => {
      PetVacinas.belongsTo(models.pets, {
        foreignKey: "petId",
        as: "pet",
      });
      PetVacinas.belongsTo(models.vacinas, {
        foreignKey: "vacinaId",
        as: "vacina",
      });
    };
  
    return PetVacinas;
  };
  