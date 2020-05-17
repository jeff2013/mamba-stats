module.exports  = function(sequelize, DataTypes) {
    var Group = sequelize.define('group', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true, 
            unique: true,
            defaultValue: DataTypes.UUIDV1
        },
        token: {
            type: DataTypes.STRING,
            unique: true,
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