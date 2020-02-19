

module.exports = function(sequelize, DataTypes) {
    var Team = require('./team')(sequelize, DataTypes);
    var User = require('./user')(sequelize, DataTypes);
    var Session = require('./sesson')(sequelize, DataTypes);
    Team.hasMany(User);
    User.belongsTo(Team, {
        foreignKey: 'team_id'
    });

    return {Team, User, Session};
}