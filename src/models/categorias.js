module.exports = (sequelize, DataTypes) => {
  const Categorias = sequelize.define(
    "categorias",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      categoria: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
    },
    {
      tableName: "categorias",
    }
  );

  return Categorias;
};
