module.exports = function(sequelize, DataTypes) {
    var Session = sequelize.define('session', {
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
        date: {
            type: DataTypes.DATE
        },
        duration: {
            type: DataTypes.INTEGER
        },
        end_date: {
            type: DataTypes.DATE
        }
    },{
        paranoid: true,
        timestamps: true
    })
    return Session;
}