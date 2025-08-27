"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

// 👇 importa o driver explicitamente (assim a Vercel inclui no bundle)
const mysql2 = require("mysql2");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "production";
const config = require(__dirname + "/../config/config.js")[env];

// 👇 garante que o dialect e o módulo do driver estão definidos
config.dialect = config.dialect || "mysql";
config.dialectModule = mysql2;

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    ...config,
    dialectModule: mysql2, // reforço
  });
} else {
    sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      ...config,
      dialectModule: mysql2, // reforço
    }
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
