module.exports = (sequelize, DataTypes) => {
    const Vacinas = sequelize.define(
        "vacinas", // Verifique se o nome está em minúsculas ou consistentes com as suas práticas
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            nomeVacina: {
                type: DataTypes.STRING(70),
                allowNull: true,
            },
        },
        {
            tableName: "vacinas",
        }
    );

    Vacinas.associate = (models) => {
        Vacinas.hasMany(models.petVacinas, {
            foreignKey: "vacinaId",
            as: "petsRelacionados",
        });
    };

    return Vacinas;
};