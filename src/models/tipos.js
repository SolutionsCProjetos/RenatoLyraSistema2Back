module.exports = (sequelize, DataTypes) => {
  const Tipos = sequelize.define(
    "tipo", // Verifique se o nome está em minúsculas ou consistentes com as suas práticas
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      comercio: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      tableName: "tipo",
    }
  );

  Tipos.associate = (models) => {
    // Associação correta entre Tipos e Usuario
    Tipos.hasMany(models.parceiros, {
      foreignKey: "tipoId", // Chave estrangeira que está no modelo Usuario
      as: "parceiro", // Nome do alias para a associação
    });
  };

  return Tipos;
};
