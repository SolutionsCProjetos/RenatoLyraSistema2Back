module.exports = (sequelize, DataTypes) => {
    const Pets = sequelize.define(
        "pets",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            nomePet: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            clienteId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "cliente",
                    key: "id",
                },
                allowNull: false,
            },
            raca: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            dataNascimento: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            especie: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            pelagem: {
                type: DataTypes.ENUM("PELO CURTO", "PELO MEDIO", "PELO LONGO"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["PELO CURTO", "PELO MEDIO", "PELO LONGO"]],
                        msg: "Revise a pelagem",
                    },
                },
            },
            corPelo: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            sexo: {
                type: DataTypes.ENUM("MACHO", "FÊMEA"),
                allowNull: false,
            },
            numeroChip: {
                type: DataTypes.BIGINT,
                allowNull: true,
                unique: true, // Evita duplicação de chips
                validate: {
                    isNumeric: {
                        msg: "O número do chip deve conter apenas números",
                    },
                },
            },
            porte: {
                type: DataTypes.ENUM("PEQUENO", "MEDIO", "GRANDE"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["PEQUENO", "MEDIO", "GRANDE"]],
                        msg: "Revise o porte",
                    },
                },
            },
            situacao: {
                type: DataTypes.ENUM("VIVO", "MORTO"),
                allowNull: false,
                defaultValue: "VIVO",
                validate: {
                    isIn: {
                        args: [["VIVO", "MORTO"]],
                        msg: "Revise a situação",
                    },
                },
            },
            pesoAtual: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            obs: {
                type: DataTypes.STRING(300),
                allowNull: true,
            },
        },
        {
            freezeTableName: true,
        }
    );

    Pets.associate = (models) => {
        Pets.belongsTo(models.cliente, {
          foreignKey: "clienteId",
          as: "cliente",
        });
      
        Pets.hasMany(models.historicoPesos, {
          foreignKey: "petId",
          as: "historicoPesos",
        });
      
        Pets.hasMany(models.petVacinas, {
          foreignKey: "petId",
          as: "vacinasRelacionadas",
        });
      };

    return Pets;
};
