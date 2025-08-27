module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define(
    "usuarios",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      empresa: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rule: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      setorId: {
        type: DataTypes.INTEGER,
        references: {
          model: "setores", // Deve corresponder ao nome da tabela no banco de dados
          key: "id",
        },
        allowNull: true,
      },
    },
    {
      tableName: "usuarios",
    }
  );

  Usuario.associate = (models) => {
    // Associação  entre Usuario e Setores
    Usuario.belongsTo(models.setores, {
      foreignKey: "setorId",
      as: "setor",
    });
  };

  return Usuario;
};
