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
            allowNull: false
        },
        team_id: {
            type: DataTypes.UUID 
        },
        ppg: {
            type: DataTypes.REAL,
            defaultValue: 0.0
        },
        apg: {
            type: DataTypes.REAL,
            defaultValue: 0.0
        },
        rpg: {
            type: DataTypes.REAL,
            defaultValue: 0.0
        }
    }, {
        paranoid: true,
        timestamps: true,
    });

    return User;
}