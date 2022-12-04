const { Sequelize, Model } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('databooking', 'root', "123456", {
  host: 'localhost',
  dialect: 'mysql' ,/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  logging:false
});

let connectDB = async() => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
module.exports = connectDB;