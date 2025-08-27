module.exports = (sequelize, DataTypes) => {
    const Manejo = sequelize.define(
        'manejo',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            petId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "pets",
                    key: "id",
                },
            },
            parceiroId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "parceiros",
                    key: "id",
                },
            },
            alimentacao: {
                type: DataTypes.STRING(300),
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 300],
                        msg: "A alimentação deve ter no máximo 300 caracteres.",
                    },
                },
            },
            tipoAlimentacao: {
                type: DataTypes.ENUM("Ração", "Comida Natural", "Ambos", "Outro"),
                allowNull: true,
            },
            horariosAlimentacao: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            acessoAguaFresca: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            ambiente: {
                type: DataTypes.ENUM("Interno", "Externo", "Ambos"),
                allowNull: true,
            },
            atividadeFisica: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            contatoComOutrosAnimais: {
                type: DataTypes.ENUM("Nenhum", "Pouco", "Frequentemente"),
                allowNull: true,
            },
        },
        {
            timestamps: true,
            tableName: "manejo",
        }
    );

    Manejo.associate = (models) => {
        Manejo.belongsTo(models.pets, {
            foreignKey: "petId",
            as: "pet",
        });
        Manejo.belongsTo(models.parceiros, {
            foreignKey: "parceiroId",
            as: "parceiro",
        });
    };

    return Manejo;
};
