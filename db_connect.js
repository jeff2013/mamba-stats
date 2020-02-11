const Sequelize = require('sequelize')
const dbConfig = require('./config/db.js');
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: 'postgres',
    port: dbConfig.port,
    logging: true
})

module.exports = {
    'Sequelize' : Sequelize,
    'sequelize' : sequelize
}