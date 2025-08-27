module.exports = (sequelize, DataTypes) => {
    const Solicitante = sequelize.define(
      "solicitantes",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        solicitante: {
          type: DataTypes.STRING(150),
          allowNull: true,
        },
        nomeCompleto: {
          type: DataTypes.STRING(200),
          allowNull: true,
        },
        cpf: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        titulo: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        telefoneContato: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        telefoneContato2: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        cep: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        endereco: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        num: {
          type: DataTypes.STRING(15),
          allowNull: true,
        },
        bairro: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        zona: {
          type: DataTypes.STRING(35),
          allowNull: true,
        },
        pontoReferencia: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        secaoEleitoral: {
          type: DataTypes.STRING(45),
          allowNull: true,
        },
      },
      {
        freezeTableName: true,
      }
    );
    return Solicitante;
}


/* ALTER TABLE `ongsdb`.`solicitantes` 
ADD COLUMN `cep` VARCHAR(255) NULL DEFAULT NULL AFTER `email`,
ADD COLUMN `endereco` VARCHAR(255) NULL DEFAULT NULL AFTER `cep`,
ADD COLUMN `bairro` VARCHAR(80) NULL DEFAULT NULL AFTER `endereco`,
ADD COLUMN `num` VARCHAR(15) NULL DEFAULT NULL AFTER `bairro`,
ADD COLUMN `zona` VARCHAR(35) NULL DEFAULT NULL AFTER `num`,
ADD COLUMN `pontoReferencia` VARCHAR(255) NULL DEFAULT NULL AFTER `zona`,
CHANGE COLUMN `zonaEleitoral` `tituloEleitoral` VARCHAR(50) NULL DEFAULT NULL ;
*/

/* 
ALTER TABLE `ongsdb`.`solicitantes` 
DROP COLUMN `tituloEleitoral`;
*/