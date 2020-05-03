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