module.exports = (sequelize, DataTypes) => {
const FormasPagamento = sequelize.define(
  "formapagamento",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    tipo: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Precisa ser inserido uma forma de pagamento",
        },
      },
      unique: true,
    },
  },
  {
    freezeTableName: true,
  }
);
  return FormasPagamento;
}