module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('user', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            unique: true,
            defaultValue: DataTypes.UUIDV1
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                customValidator(value) {
                    if (value === null || value === "") {
                        throw new Error("No name provided");
                    }
                }
            }
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Guard'
        },
        points: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        assists: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        rebounds: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        fouls: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        games_played: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        sessions_attended: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        paranoid: true,
        timestamps: true,
    });

    return User;
}