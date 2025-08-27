module.exports = (sequelize, DataTypes) => {
    const Mensagens = sequelize.define(
        "mensagens",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            titulo: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            dias_relativos: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            mensagem: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            antes_ou_depois: {
                type: DataTypes.ENUM("antes", "depois"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["antes", "depois"]],
                        msg: "Verificar o antes ou depois",
                    },
                },
            },
            tipo: {
                type: DataTypes.ENUM("lembrete", "cobrança"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["lembrete", "cobrança"]],
                        msg: "Verificar o antes ou depois",
                    },
                },
            }
        },
        {
            freezeTableName: true,
        }
    );

    return Mensagens;
}