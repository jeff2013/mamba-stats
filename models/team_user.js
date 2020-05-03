module.exports = function(sequelize, DataTypes) {
    var TeamUser = sequelize.define('team_user', {}, {
        timestamps: true
    })
    return TeamUser;
}