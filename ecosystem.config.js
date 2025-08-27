module.exports = {
  apps: [
    {
      name: 'Ongs',
      script: './src/server.js',
      env: {
        NODE_ENV: 'production',
        DB_NAME: process.env.DB_NAME,
        DB_USER: process.env.DB_USER,
        DB_PWD: process.env.DB_PWD,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_DIALECT: process.env.DB_DIALECT
      },
      env_production: {
        NODE_ENV: 'production',
        DB_NAME: 'ongsdb',
        DB_USER: 'root',
        DB_PWD: 'Sfc@1234',
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_DIALECT: 'mysql'
      }
    }
  ]
};
