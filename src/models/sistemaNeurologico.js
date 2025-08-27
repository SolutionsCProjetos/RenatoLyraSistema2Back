module.exports = (sequelize, DataTypes) => {
    const SistemaNeurologico = sequelize.define(
        'sistemaNeurologico',
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
            convulsoes: {
                type: DataTypes.STRING(150),
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 150],
                        msg: "As convulsões devem ter no máximo 150 caracteres.",
                    },
                },
            },
            alteracaoComportamental: {
                type: DataTypes.STRING(150),
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 150],
                        msg: "A alteração comportamental deve ter no máximo 150 caracteres.",
                    },
                },
            },
            andarEmCirculo: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            headTilt: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            nistagmo: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            paralisia: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            tremores: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            ataxia: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            reflexosAlterados: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            descricaoGeral: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: "sistemaNeurologico",
        }
    );

    SistemaNeurologico.associate = (models) => {
        SistemaNeurologico.belongsTo(models.pets, {
            foreignKey: "petId",
            as: "pet",
        });
        SistemaNeurologico.belongsTo(models.parceiros, {
            foreignKey: "parceiroId",
            as: "parceiro",
        });
    }
    return SistemaNeurologico;
}