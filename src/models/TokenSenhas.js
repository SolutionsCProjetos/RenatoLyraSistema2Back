module.exports = (sequelize, DataTypes) => {
  const TokenSenha = sequelize.define(
    "tokensenha", // Modifique aqui para começar com letra maiúscula
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Precisa ser informado o token.",
          },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "usuarios",
          key: "id",
        },
        allowNull: false,
      },
      used: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      freezeTableName: true,
    }
  );

  TokenSenha.associate = (models) => {
    TokenSenha.belongsTo(models.usuarios, {
      foreignKey: "userId",
      as: "usuario",
    });
  };

  return TokenSenha;
};
