module.exports  = function(sequelize, DataTypes) {
    var Game = sequelize.define('session', {
        id: {
            type: DataTypes.UUID,
            allowNUll: false,
            primaryKey: true,
            unique: true,
            defaultValue: DataTypes.UUIDV1
        },
        home_team_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        away_team_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        session_id: {
            type: DataTypes.UUID,
            // FIX ME: Change to FALSE 
            allowNull: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        home_points: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            defaultValue: 0
        },
        away_points: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            defaultValue: 0
        }
    })
    return Game;
}