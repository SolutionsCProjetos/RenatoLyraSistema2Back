module.exports = (sequelize, DataTypes) => {
    const SistemaCardio = sequelize.define(
      "sistemaCardio",
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
        secrecao: {
          type: DataTypes.ENUM("Nasal", "Ocular", "Nasal e Ocular", "Nenhuma"),
          allowNull: true,
          validate: {
            isIn: {
              args: [["Nasal", "Ocular", "Nasal e Ocular"]],
              msg: "O valor deve ser um dos seguintes: Nasal, Ocular, Nenhuma, Nasal e Ocular",
            },
          },
        },
        descricao: {
          type: DataTypes.STRING(300),
          allowNull: true,
          validate: {
            len: {
              args: [0, 300],
              msg: "A descrição deve ter no máximo 300 caracteres.",
            },
          },
        },
        sincope: {
          type: DataTypes.BOOLEAN(),
          allowNull: true,
        },
        tosse: {
          type: DataTypes.BOOLEAN(),
          allowNull: true,
        },
        espirro: {
          type: DataTypes.BOOLEAN(),
          allowNull: true,
        },
        districao_resp: {
          type: DataTypes.BOOLEAN(),
          allowNull: true,
        },
        cianose: {
          type: DataTypes.BOOLEAN(),
          allowNull: true,
        },
        intolerancia_exer: {
          type: DataTypes.BOOLEAN(),
          allowNull: true,
        },
        cansacoFacil: {
          type: DataTypes.BOOLEAN(),
          allowNull: true,
        },
      },
      {
        tableName: "sistemaCardio",
      }
    );
    
    SistemaCardio.associate = (models) => {
        SistemaCardio.belongsTo(models.pets, {
            foreignKey: "petId",
            as: "pet",
        });
        SistemaCardio.belongsTo(models.parceiros, {
            foreignKey: "parceiroId",
            as: "parceiro",
        });
    }
    return SistemaCardio;
}