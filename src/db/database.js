const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PWD,
  {
    host: process.env.DB_HOST,
    port: "3306",
    dialect: "mysql",
    timezone: "-03:00",
    pool: {
      max: 20,
      min: 0,
      acquire: 3000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
