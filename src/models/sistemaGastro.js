module.exports = (sequelize, DataTypes) => {
    const SistemaGastro = sequelize.define(
        'sistemaGastro',
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
            apetite: {
                type: DataTypes.ENUM("Normorexia", "Anorexia", "Hipofagia", "Polifagia"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["Normorexia", "Anorexia", "Hipofagia", "Polifagia"]],
                        msg: "O valor deve ser um dos seguintes: Normorexia, Anorexia, Hipofagia, Polifagia.",
                    },
                },
            },
            frequencia: {
                type: DataTypes.STRING(300),
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 300],
                        msg: "A frequencia deve ter no máximo 300 caracteres.",
                    },
                },
            },
            coloracao: {
                type: DataTypes.STRING(300),
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 300],
                        msg: "A coloração deve ter no máximo 300 caracteres.",
                    },
                },
            },
            hematemese: {
                type: DataTypes.BOOLEAN(),
                allowNull: true,
            },
            diarreia: {
                type: DataTypes.BOOLEAN(),
                allowNull: true,
            },
            melena: {
                type: DataTypes.BOOLEAN(),
                allowNull: true,
            },
            hematoquesia: {
                type: DataTypes.BOOLEAN(),
                allowNull: true,
            },
            disquesia: {
                type: DataTypes.BOOLEAN(),
                allowNull: true,
            },
            tenesmo: {
                type: DataTypes.BOOLEAN(),
                allowNull: true,
            },
            aquesia: {
                type: DataTypes.BOOLEAN(),
                allowNull: true,
            },
        },
        {
            tableName: "sistemaGastro",
        }
    );
    
    SistemaGastro.associate = (models) => {
        SistemaGastro.belongsTo(models.pets, {
            foreignKey: "petId",
            as: "pet",
        });
        SistemaGastro.belongsTo(models.parceiros, {
            foreignKey: "parceiroId",
            as: "parceiro",
        });
    }
    return SistemaGastro;
}