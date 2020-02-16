'use strict';

let db = require('./db_connect.js');
let {Team, User} = require('./models/models')(db.sequelize, db.Sequelize);
let sync = require('./models/sync.js');

/**
 **************************
 ********* USERS **********
 **************************
 */

module.exports.getAllUsers = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const textResponseHeaders = {
    'Content-Type': 'text/plain'
  };

  const jsonResponseHeaders = {
    'Content-Type': 'application/json'
  };

  await User.findAll()
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

module.exports.createUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const textResponseHeaders = {
    'Content-Type': 'text/plain'
  };

  const jsonResponseHeaders = {
    'Content-Type': 'application/json'
  };

  // WRITE SOME SORT OF VALIDATION
  return User.create(
    JSON.parse(event.body)
  ).then(user => {
    const response = {
      statusCode: 200, 
      headers: jsonResponseHeaders,
      body: JSON.stringify(user)
    };
    callback(null, response)
  }).catch(e => {
    callback(null, {
      statusCode: 409, 
      headers: textResponseHeaders, 
      body: "Couldn't create a user"
    })
  })
};

/**
 **************************
 ********* TEAMS **********
 **************************
 */

 

/**
 **************************
 ******** HELPERS *********
 **************************
 */

module.exports.modelSync = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const textResponseHeaders = {
    'Content-Type': 'text/plain'
  };

  const jsonResponseHeaders = {
    'Content-Type': 'application/json'
  };

  const options = JSON.parse(event.body)

  return sync(options).then(_ => {
    const response = {
      statusCode: 200,
      headers: textResponseHeaders,
      body: "SYNC SUCCESS",
    };
    callback(null, response);  
  }).catch(err => {
    const response = {
      statusCode: 501,
      headers: textResponseHeaders,
      body: "Couldn't sync models to database " + error,
    };
    callback(null, response);  
  });
  // .then(_ => {
  //   const response = {
  //     statusCode: 200,
  //     headers: jsonResponseHeaders,
  //     body: "SYNC SUCCESS",
  // };
  //   callback(null, response);
  // }).catch(error => {
  //   console.error(error);
  //   callback(null, {
  //       statusCode: 501,
  //       headers: textResponseHeaders,
  //       body: "Couldn't sync models to database " + error
  //   });
  // })

};