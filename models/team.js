module.exports = function(sequelize, DataTypes) {
    var Team = sequelize.define('team', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            unique: true,
            defaultValue: DataTypes.UUIDV1
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        paranoid: true, 
        timestamps: true
    });
    return Team;
}