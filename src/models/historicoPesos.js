module.exports = (sequelize, DataTypes) => {
    const HistoricoPesos = sequelize.define(
        "historicoPesos",
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
            },
            peso: {
                type: DataTypes.FLOAT,
                allowNull: false,
                validate: {
                    isFloat: {
                        msg: "O peso deve ser um número válido.",
                    },
                    min: {
                        args: [0.1],
                        msg: "O peso deve ser maior que zero.",
                    },
                },
            },
            dataRegistro: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            freezeTableName: true,
        }
    );

    HistoricoPesos.associate = (models) => {
        HistoricoPesos.belongsTo(models.pets, {
            foreignKey: "petId",
            as: "pet",
        });
    };

    return HistoricoPesos;
};
