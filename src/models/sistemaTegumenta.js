module.exports = (sequelize, DataTypes) => {
    const SistemaTegumentar = sequelize.define(
        'sistemaTegumentar',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
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
            prurido: {
                type: DataTypes.STRING(320),
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 320],
                        msg: "O prurido devem ter no máximo 320 caracteres.",
                    },
                },
            },
            alopecia: {
                type: DataTypes.STRING(320),
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 320],
                        msg: "A alopecia deve ter no máximo 320 caracteres.",
                    },
                },
            },
            descamacao: {
                type: DataTypes.STRING(320),
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 320],
                        msg: "A descamação deve ter no máximo 320 caracteres.",
                    },
                },
            },
            meneiosCefalicos: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            secrecaoOtologica: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            puliciose: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            infestacaoCarrapatos: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            hiperqueratose: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            pustulas: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            eritema: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            edema: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            nodulosOuMassas: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            corTexturaPelo: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            descricaoGeral: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: "sistemaTegumentar",
        }
    );

    SistemaTegumentar.associate = (models) => {
        SistemaTegumentar.belongsTo(models.pets, {
            foreignKey: "petId",
            as: "pet",
        });
        SistemaTegumentar.belongsTo(models.parceiros, {
            foreignKey: "parceiroId",
            as: "parceiro",
        });
    }
    return SistemaTegumentar;
}