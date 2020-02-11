'use strict';

let db = require('./db_connect.js');
let User = require('./models/user')(db.sequelize, db.Sequelize);


module.exports.getAllUsers = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const textResponseHeaders = {
    'Content-Type': 'text/plain'
  };

  const jsonResponseHeaders = {
    'Content-Type': 'application/json'
  };

  User.findAll()
    .then(users => {
      console.log(users);
        const response = {
            statusCode: 200,
            headers: jsonResponseHeaders,
            body: JSON.stringify(users),
        };
      callback(null, response);
    })
    .catch(error => {
      console.error(error);
      callback(null, {
          statusCode: 501,
          headers: textResponseHeaders,
          body: "Couldn't find Users, Error finding from DB, Error: " + error
      });
    })
};

module.exports.getAllTodos = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  db.getAll('todo')
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(res)
      })
    })
    .catch(e => {
      console.log(e);
      callback(null, {
        statusCode: e.statusCode || 500,
        body: 'Error: Could not find Todos: ' + e
      })
    })
};