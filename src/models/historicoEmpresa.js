module.exports = (sequelize, DataTypes) => {
  const HistoricoEmpresa = sequelize.define(
    "historicoEmpresa",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      empregoId: {
        type: DataTypes.INTEGER,
        references: {
          model: "candidatos",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      empresas: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      funcao: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      data: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dataDemissao: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
    }
  );

  HistoricoEmpresa.associate = (models) => {
    HistoricoEmpresa.belongsTo(models.candidatos, {
      foreignKey: "empregoId",
      as: "canditado",
    });
  };

  return HistoricoEmpresa;
};
