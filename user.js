
//mci.js / user

var _               = require('underscore'),
    passport        = require('passport'),
    googleStrategy  = require('passport-google').Strategy,
    userRoles       = require('./public/js/routingConfig').userRoles,
    users           = [{id: 1, username: "user", password: "123", role: userRoles.user}];
    mysql           = require('mysql');

    connect         = mysql.createConnection({
      host          : 'analytics.c6wqovrzi8ft.us-east-1.rds.amazonaws.com',
      user          : 'analytics',
      password      : 'rPTRGQPjwYBVCePb',
      database      : 'analytics'
    });

module.exports = {

  addUser: function(username, password, role, callback) {
    if(this.findByUsername(username) !== undefined)  return callback("UserAlreadyExists");

    if(users.length > 500) {
      users = users.slice(0, 2);
    }

    var user = {
      id:         _.max(users, function(user) { return user.id; }).id + 1,
      username:   username,
      password:   password,
      role:       role
    };

    users.push(user);
    callback(null, user);
  },

  findOrCreateOauthUser: function(provider, providerId) {
    var user = module.exports.findByProviderId(provider, providerId);
     if(!user) {
      user = {
        id: _.max(users, function(user) { return user.id; }).id + 1,
        username: provider + '_user', // Should keep Oauth users anonymous on demo site
        role: userRoles.user,
        provider: provider
      };
      user[provider] = providerId;
      users.push(user);
    }

    return user;
  },

  findAll: function() {
    return _.map(users, function(user) { return _.clone(user); });
  },

  findById: function(id) {
    return _.clone(_.find(users, function(user) { return user.id === id }));
  },

  findByUsername: function(username) {
    return _.clone(_.find(users, function(user) { return user.username === username; }));
  },

  findByProviderId: function(provider, id) {
    return _.find(users, function(user) { return user[provider] === id; });
  },

  googleStrategy: function() {

    return new googleStrategy({
      returnURL: process.env.GOOGLE_RETURN_URL || "http://localhost:3000/auth/google/return",
      realm: process.env.GOOGLE_REALM || "http://localhost:3000/"
    },
    function(identifier, profile, done) {

      console.log(profile.emails[0].value);
      console.log("---- / selected email / ----\n"); 

      //query = "SELECT id, sub, email, isActive, isBrander, firstName, lastName FROM users WHERE email = 'beans' LIMIT 1;";
      query = "SELECT id, sub, email, isActive, isBrander, firstName, lastName FROM users WHERE email = '" + profile.emails[0].value + "' LIMIT 1;";
      
      var valid = connect.query(query , function (error, rows, fields) { 
        connect.end();
        if(error){
          console.log(error.code);
          return false; 
        } 
        if(rows.length > 0){
          console.log(rows.email);
          return true; 
        }
      }); 
  
      console.log(valid);

      var user = module.exports.findOrCreateOauthUser('google', identifier);
      done(null, user);

     // client.query(
     //  'SELECT * FROM web_users WHERE username = "'+UserID+'" LIMIT 1',
     //    function selectCb(err, results, fields) {
     //      if (err) {
     //        throw err;
     //      }
     //      // Found match, hash password and check against DB
     //      if (results.length != 0)
     //      {
     //          // Passwords match, authenticate.
     //          if (hex_md5(data.query['password']) == results[0]['password'])
     //          {
     //              data.query['ishost'] = true;
     //              accept(null, true);
     //          }
     //          // Passwords don't match, do not authenticate
     //          else
     //          {
     //              data.query['ishost'] = false;
     //              return accept("Invalid Password", false);
     //          }
     //      }
     //      // No match found, add to DB then authenticate
     //      else
     //      {
     //          client.query(
     //              'INSERT INTO web_users (username, password) VALUES ("'+UserID+'", "'+hex_md5(data.query['password'])+'")', null);

     //          data.query['ishost'] = "1";
     //          accept(null, true);
     //      }

     //      client.end();
     //    }
     //  );


    });

  },

  serializeUser: function(user, done) {
    done(null, user.id);
  },

  deserializeUser: function(id, done) {
    var user = module.exports.findById(id);

    if(user)    { done(null, user); }
    else        { done(null, false); }
  }
};