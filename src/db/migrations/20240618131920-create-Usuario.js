"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("usuarios", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      empresa: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rule: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      setorId: {
        type: Sequelize.INTEGER,
        references: {
          model: "setores",
          key: "id",
        },
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Inserir dados iniciais
    return queryInterface.bulkInsert("usuarios", [
      {
        nome: "supervisor",
        email: "adm@solutions.com",
        senha: await bcrypt.hash("qaz@123", 10), // substitua 'password' pela senha desejada
        empresa: "Solutions",
        rule: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("usuarios");
  },
};
