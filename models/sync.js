
let db = require('../db_connect.js');
// emit handling:

module.exports = function(options) {
    return db.sequelize.sync(options);
}