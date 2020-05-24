module.exports  = function(sequelize, DataTypes) {
    var Group = sequelize.define('group', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
            defaultValue: DataTypes.UUIDV1
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        token: {
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        }
    })
    return Group;
}