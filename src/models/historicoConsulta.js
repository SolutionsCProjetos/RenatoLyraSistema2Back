module.exports = (sequelize, DataTypes) => {
    const HistoricoConsulta = sequelize.define(
      "historicoConsulta",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        petId: {
          type: DataTypes.INTEGER,
          references: {
            model: "pets",
            key: "id",
          },
          allowNull: false,
          onDelete: "CASCADE", // Adiciona a exclusão em cascata
          onUpdate: "CASCADE", // Adiciona a exclusão em cascata
        },
        consulta: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        freezeTableName: true,
      }
    );

    HistoricoConsulta.associate = (models) => {
        HistoricoConsulta.belongsTo(models.pets, {
            foreignKey: "petId",
            as: "pet",
        });
    };

    return HistoricoConsulta;
};
