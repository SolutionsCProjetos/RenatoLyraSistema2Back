module.exports = (sequelize, DataTypes) => {
    const Raca = sequelize.define(
      "racas", // Verifique se o nome está em minúsculas ou consistentes com as suas práticas
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        raca: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
      },
      {
        tableName: "racas",
      }
    );
  
    return Raca;
  };