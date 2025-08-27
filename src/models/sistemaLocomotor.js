module.exports = (sequelize, DataTypes) => {
    const SistemaLocomotor = sequelize.define(
        'sistemaLocomotor',
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
            claudicacao: {
                type: DataTypes.STRING(150),
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 150],
                        msg: "A cladicação deve ter no máximo 150 caracteres.",
                    },
                    isAlpha: {
                        msg: "A cladicação deve conter apenas letras.",
                    },
                },
            },
            dorTransporObstaculos: {
                type: DataTypes.STRING(150),
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 150],
                        msg: "A dor ao transpor obstaculos deve ter no máximo 150 caracteres.",
                    },
                },
            },
            paresia: {
                type: DataTypes.STRING(150),
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 150],
                        msg: "A paresia deve ter no máximo 150 caracteres.",
                    },
                    isAlpha: {
                        msg: "A paresia deve conter apenas letras.",
                    },
                },
            },
            impoteciaFuncional: {
                type: DataTypes.STRING(150),
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 150],
                        msg: "A Impotência funcional deve ter no máximo 150 caracteres.",
                    },
                    isAlpha: {
                        msg: "A Impotência funcional deve conter apenas letras.",
                    },
                },
            },
            inflamacao: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            edema: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            deformidade: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            restricaoMovimento: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            descricaoGeral: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: "sistemaLocomotor",
        }
    );

    SistemaLocomotor.associate = (models) => {
        SistemaLocomotor.belongsTo(models.pets, {
            foreignKey: "petId",
            as: "pet",
        });
        SistemaLocomotor.belongsTo(models.parceiros, {
            foreignKey: "parceiroId",
            as: "parceiro",
        });
    }
    return SistemaLocomotor;
}