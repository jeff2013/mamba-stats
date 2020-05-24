'use strict';

let db = require('./db_connect.js');
let {Team, User, TeamUser, Session, Group} = require('./models/models')(db.sequelize, db.Sequelize);
let sync = require('./models/sync.js');
const { RandomToken } = require('@sibevin/random-token')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs-then');

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
  
  const groupId = event.requestContext.authorizer.principalId
  return User.findAll({
    where: {
      groupToken: groupId
    }
  })
    .then(users => {
      const response = {
          statusCode: 200,
          headers: jsonResponseHeaders,
          body: JSON.stringify(users),
      };
      callback(null, response);
    })
    .catch(error => {
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

  var token = event.requestContext.authorizer.principalId || '';
  return User.create(
    {
      ...JSON.parse(event.body),
      groupToken: token
    }
  ).then(user => {
    const response = {
      statusCode: 201, 
      headers: jsonResponseHeaders,
      body: JSON.stringify(user)
    };
    callback(null, response)
  }).catch(e => {
    callback(null, {
      statusCode: 400, 
      headers: textResponseHeaders, 
      body: "Couldn't create a user" + e
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

  var token = event.requestContext.authorizer.principalId || '';
  var newUserData = JSON.parse(event.body);
  // FIX ME AND ADD TOKEN
  return User.update(newUserData, {returning: true, where: {id: newUserData.id, groupToken: token}}).then(user => {
    const response = {
      statusCode: 202,
      headers: jsonResponseHeaders,
      body: JSON.stringify(user)
    };
    callback(null, response);
  }).catch(e => {
    callback(null, {
      statusCode: 400, 
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
  
  var token = event.requestContext.authorizer.principalId || '';
  return User.destroy({
    where: { id: event.pathParameters.id, groupToken: token }
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

  const data = JSON.parse(event.body);
  const name = data.team.name;
  const playerIds = data.team.players;
  var token = event.requestContext.authorizer.principalId || '';

  return Team.create({name: name, groupToken: token}
  ).then(team => {
    this.team = team;
    const teamUsers = [];
    playerIds.map(id => {
      teamUsers.push(
        TeamUser.create({
          teamId: team.id,
          userId: id
        })
       );
    })

    return Promise.all(teamUsers);
  }).then(_ => {

    /**
     * FIXME
     * Find a more efficient way of doing this...
     */
    return Team.findOne({
      include: [{
        model: User
      }],
      where: {
        groupToken: token,
        id: this.team.id
      }
    })
  }).then(team =>{
    const response = {
      statusCode: 201, 
      headers: jsonResponseHeaders,
      body: JSON.stringify(team)
    };
    callback(null, response)
  }).catch(e => {
    console.log(e);
    callback(null, {
      statusCode: 400, 
      headers: textResponseHeaders, 
      body: "Failed to create the team."
    })
  });
 };

 module.exports.getAllTeams = (event, context, callback) => {
   context.callbackWaitsForEmptyEventLoop = false;

   const textResponseHeaders = {
    'Content-Type': 'text/plain'
  };

  const jsonResponseHeaders = {
    'Content-Type': 'application/json'
  };

  var token = event.requestContext.authorizer.principalId || '';

  return Team.findAll({
      include: [{
        model: User
      }],
      where: {
        groupToken: token
      }
    })
    .then(teams => {
      const response = {
        statusCode: 200,
        headers: jsonResponseHeaders,
        body: JSON.stringify(teams),
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(null, {
        statusCode: 400,
        headers: textResponseHeaders,
        body: "Couldn't find Teams, Error finding from DB, Error: " + err
    });
    })
 }

 /**
  * 
  * Get all users for a given team
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
 ********** GROUP *********
 **************************
 */

 module.exports.createGroup = (event, context, callback) => {
   context.callbackWaitsForEmptyEventLoop = false;

    const textResponseHeaders = {
      'Content-Type': 'text/plain'
    };

    const jsonResponseHeaders = {
      'Content-Type': 'application/json'
    };

    var groupData = event.body ? JSON.parse(event.body) : {};
    groupData["token"] = RandomToken.gen({length: 4});
    console.log(groupData);
    return bcrypt.hash(groupData["password"], 8)
    .then(pass => {
      groupData["password"] = pass
      return Group.create(groupData)
    }).then(group => {
      const response = {
        statusCode: 200, 
        headers: jsonResponseHeaders,
        body: JSON.stringify({ id: group.token, token: signToken(group.token), auth: true, })
      };
      callback(null, response)
    }).catch(e => {
      console.log(e);
      callback(null, {
        statusCode: 409, 
        headers: textResponseHeaders, 
        body: "Couldn't create a group" + e
      })
    });
 }

 /**
  * Should contain token and password
  */
 module.exports.login = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const textResponseHeaders = {
      'Content-Type': 'text/plain'
    };

    const jsonResponseHeaders = {
      'Content-Type': 'application/json'
    };

    var loginData = event.body ? JSON.parse(event.body) : {};
    var group = null;
    var groupName = loginData['name'] || '';
    var password = loginData['password'] || '';
    return Group.findOne({
      where: {
        name: groupName
      }
    })
    .then(group => {
      this.group = group;
      return bcrypt.compare(password, group.password)
    })
    .then(isValid => {
      if (isValid) {
        const response = {
          statusCode: 200, 
          headers: jsonResponseHeaders,
          body: JSON.stringify({ id: this.group.token, token: signToken(this.group.token), auth: true, })
        };
        callback(null, response)
      } else {
        callback(null, {
          statusCode: 409, 
          headers: textResponseHeaders, 
          body: "Invalid login"
        })
      }
    }).catch(e => {
      callback(null, {
        statusCode: 409, 
        headers: textResponseHeaders, 
        body: "Invalid login" + e
      })
    })
 }
 
 module.exports.me = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return me(event.requestContext.authorizer.principalId)
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: { stack: err.stack, message: err.message }
    }));
};

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
      body: "Couldn't sync models to database " + err
    };
    callback(null, response);  
  });
};

function me(token) {
  return Group.findOne({
    where: {
      token: token 
    }
  })
    .then(group =>
      !group
        ? Promise.reject('No group found.')
        : group
    )
    .catch(err => Promise.reject(new Error(err)));
}

function signToken(id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: 86400 // expires in 24 hours
  });
}

function login(eventBody) {
  return Group.findOne({ token: eventBody.token })
    .then(group =>
      !group
        ? Promise.reject(new Error('Group with that token does not exits.'))
        : comparePassword(eventBody.password, group.password, group.token)
    )
    .then(token => ({ auth: true, token: token }));
}

function comparePassword(eventPassword, groupPassword, groupToken) {
  return bcrypt.compare(eventPassword, groupPassword)
    .then(passwordIsValid =>
      !passwordIsValid
        ? Promise.reject(new Error('The credentials do not match.'))
        : signToken(groupToken)
    );
}