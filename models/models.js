

module.exports = function(sequelize, DataTypes) {
    /**
     * MODELS
     */
    var Team = require('./team')(sequelize, DataTypes);
    var User = require('./user')(sequelize, DataTypes);
    var TeamUser = require('./team_user')(sequelize, DataTypes);
    var Session = require('./session')(sequelize, DataTypes);
    var Game = require('./game')(sequelize, DataTypes);
    var Group = require('./group')(sequelize, DataTypes);

    /**
     * ASSOCIATIONS
     */
    User.belongsToMany(Team, { through: 'team_user' });
    Team.belongsToMany(User, { through: 'team_user' });
    User.belongsTo(Group)
    Team.belongsTo(Group)
    Group.hasMany(User)
    Group.hasMany(Team)
    Group.hasMany(Session);
    Session.belongsTo(Group);
    Session.hasMany(Game);
    Game.belongsTo(Session);


    return {Team, User, TeamUser, Session, Group};
}