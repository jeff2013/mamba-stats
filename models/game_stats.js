module.exports = function(sequelize, DataTypes) {
    var GameStats = sequelize.define('game_stats', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            unique: true,
            defaultValue: DataTypes.UUIDV1
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        rebounds: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        assists: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    })
    return GameStats;
}
