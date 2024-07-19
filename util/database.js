const Sequelize = require('sequelize');

// connecting to a database
// Option 3: passing parameters separately
// const sequelize = new Sequelize('database', 'username', 'password', {
//   host: 'localhost',
//   dialect: /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
// });
const sequelizeDb = new Sequelize(
  'nodejs-sequelize',
  'root',
  '', // enter password of mysql
  {
    host: 'localhost',
    dialect: 'mysql',
  },
);

module.exports = sequelizeDb;
