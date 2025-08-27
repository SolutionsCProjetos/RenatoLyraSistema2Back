module.exports = (sequelize, DataTypes) => {
  const Setores = sequelize.define(
    "setores", // Verifique se o nome está em minúsculas ou consistentes com as suas práticas
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      setor: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      tableName: "setores",
    }
  );

  Setores.associate = (models) => {
    // Associação correta entre Setores e Usuario
    Setores.hasMany(models.usuarios, {
      foreignKey: "setorId", // Chave estrangeira que está no modelo Usuario
      as: "usuarios", // Nome do alias para a associação
    });
  };

  return Setores;
};
