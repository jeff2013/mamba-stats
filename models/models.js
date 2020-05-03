

module.exports = function(sequelize, DataTypes) {
    /**
     * MODELS
     */
    var Team = require('./team')(sequelize, DataTypes);
    var User = require('./user')(sequelize, DataTypes);
    var TeamUser = require('./team_user')(sequelize, DataTypes);
    var Session = require('./sesson')(sequelize, DataTypes);
    var Game = require('./game')(sequelize, DataTypes);

    /**
     * ASSOCIATIONS
     */
    User.belongsToMany(Team, { through: 'team_user' });
    Team.belongsToMany(User, { through: 'team_user' });

    return {Team, User, TeamUser, Session};
}