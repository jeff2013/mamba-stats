module.exports  = function(sequelize, DataTypes) {
    var Game = sequelize.define('game', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
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
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    })
    return Game;
}