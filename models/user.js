module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        ppg: {
            type: DataTypes.REAL
        },
        apg: {
            type: DataTypes.REAL
        },
        rpg: {
            type: DataTypes.REAL
        }
    });
    return User;
}