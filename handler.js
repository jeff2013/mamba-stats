'use strict';

let db = require('./db_connect.js');
let {Team, User, Session} = require('./models/models')(db.sequelize, db.Sequelize);
let sync = require('./models/sync.js');
const { RandomToken } = require('@sibevin/random-token')

/**
 **************************
 ********* USERS **********
 **************************
 */

module.exports.getAllUsers = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const textResponseHeaders = {
    'Content-Type': 'text/plain'
  };

  const jsonResponseHeaders = {
    'Content-Type': 'application/json'
  };

  return User.findAll()
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

module.exports.updateUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const textResponseHeaders = {
    'Content-Type': 'text/plain'
  };

  const jsonResponseHeaders = {
    'Content-Type': 'application/json'
  };

  var newUserData = JSON.parse(event.body);
  return User.update(newUserData, {returning: true, where: {id: newUserData.id}}).then(user => {
    const response = {
      statusCode: 200,
      headers: jsonResponseHeaders,
      body: JSON.stringify(user)
    };
    callback(null, response);
  }).catch(e => {
    callback(null, {
      statusCode: 404, 
      headers: textResponseHeaders, 
      body: "Couldn't update a user" + e
    })
  })
};


module.exports.deleteUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const textResponseHeaders = {
    'Content-Type': 'text/plain'
  };
  
  return User.destroy({
    where: { id: event.pathParameters.id }
  }).then(deleted => {
    const response = {
      statusCode: 204, 
      headers: textResponseHeaders,
      body: "User deleted"
    };
    callback(null, response)
  }).catch(e => {
    callback(null, {
      statusCode: 400, 
      headers: textResponseHeaders, 
      body: "Couldn't delete a user" + e
    })
  })
}
/**
 **************************
 ********* TEAMS **********
 **************************
 */

 module.exports.createTeam = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const textResponseHeaders = {
    'Content-Type': 'text/plain'
  };

  const jsonResponseHeaders = {
    'Content-Type': 'application/json'
  };

  return Team.create(
    JSON.parse(event.body)
  ).then(team => {
    const response = {
      statusCode: 200, 
      headers: jsonResponseHeaders,
      body: JSON.stringify(team)
    };
    callback(null, response)
  }).catch(e => {
    callback(null, {
      statusCode: 409, 
      headers: textResponseHeaders, 
      body: "Couldn't create a user"
    })
  });
 };

 /**
  * 
  * @param team_id
  */
 module.exports.teamUsers = (event, context, callback) => {
   context.callbackWaitsForEmptyEventLoop = false;

   const textResponseHeaders = {
    'Content-Type': 'text/plain'
  };

  const jsonResponseHeaders = {
    'Content-Type': 'application/json'
  };

  console.log(event.queryStringParameters);
  const params = event.queryStringParameters;
  const teamId = params.team_id;

  return User.findAll({
    where: {
      team_id: teamId
    }
  }).then(users => {
    const response = {
      statusCode: 200, 
      headers: jsonResponseHeaders,
      body: JSON.stringify(users)
    };
    callback(null, response)
  }).catch(e => {
    const response = {
      statusCode: 200, 
      headers: textResponseHeaders,
      body: "Couldn't retrieve users for team " + e
    };
    callback(null, response)
  })
 }

 /**
  * @param user_id, team_id
  */
 module.exports.addUserToTeam = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const textResponseHeaders = {
    'Content-Type': 'text/plain'
  };

  const jsonResponseHeaders = {
    'Content-Type': 'application/json'
  };

  const params = JSON.parse(event.body);
  const teamId = params.team_id;
  const userId = params.user_id;

  return User.update({
    team_id: teamId
  }, 
  {
    where: {
      id : userId
    },
    returning: true
  }).then(user => {
    const response = {
      statusCode: 200, 
      headers: jsonResponseHeaders,
      body: JSON.stringify(user)
    };
    callback(null, response)
  }).catch(e => {
    const response = {
      statusCode: 200, 
      headers: textResponseHeaders,
      body: "Couldn't update user " + e
    };
    callback(null, response)
  })
 }


/**
 **************************
 ******** SESSION *********
 **************************
 */

 /**
  * 
  */
 module.exports.createSession = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const textResponseHeaders = {
    'Content-Type': 'text/plain'
  };

  const jsonResponseHeaders = {
    'Content-Type': 'application/json'
  };
  console.log(event.body);
  var sessionData = event.body ? JSON.parse(event.body) : {};
  sessionData["token"] = RandomToken.gen({length: 4});
  console.log(sessionData);
  return Session.create(
    sessionData
  ).then(session => {
    const response = {
      statusCode: 200, 
      headers: jsonResponseHeaders,
      body: JSON.stringify(session)
    };
    callback(null, response)
  }).catch(e => {
    console.log(e);
    callback(null, {
      statusCode: 409, 
      headers: textResponseHeaders, 
      body: "Couldn't create a session" + e
    })
  });
 }

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
      body: "Couldn't sync models to database " + error
    };
    callback(null, response);  
  });
};