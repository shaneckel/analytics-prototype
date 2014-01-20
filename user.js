
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
  verifyUser: function(oUser){

    var query = "SELECT id, sub, email, isActive, isBrander, firstName, lastName FROM users WHERE email = 'beans' LIMIT 1;";
    //var query = "SELECT id, sub, email, isActive, isBrander, firstName, lastName FROM users WHERE email = '" + oUser + "' LIMIT 1;";
    //var user;  

    connect.query(query , function (error, rows) { 
      if(error){
        connect.end();
        return error; 
      } 
      if(rows.length != 0){
        console.log(rows[0].email);
        return rows[0];   
       }else{
        return "failed"; 
      }
    });
    return "weed";
  },

  googleStrategy: function() {

    return new googleStrategy({
      returnURL: process.env.GOOGLE_RETURN_URL || "http://localhost:3000/auth/google/return",
      realm: process.env.GOOGLE_REALM || ""
    },
    function(identifier, profile, done) {

      console.log(profile.emails[0].value + "---- / selected email / ----\n");

      
      //user = module.exports.userVerify(profile.emails[0].value);
      
      var user = module.exports.verifyUser(profile.emails[0].value)
      
      console.log(user);

      done(null, false, { message: "I'm sorry but "+ profile.emails[0].value +" isn't on the list." });

    });


// var user = module.exports.findByUsername(username);

//   if(!user) {
//       done(null, false, { message: 'Incorrect username.' });
//   }
//   else if(user.password != password) {
//       done(null, false, { message: 'Incorrect username.' });
//   }
//   else {
//       return done(null, user);
//   }


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



  // // oauth2 strat
  //   return new GoogleStrategy({
  //     consumerKey: "967956446955.apps.googleusercontent.com",
  //     consumerSecret: "RdxTw7y-_SUyzaIefNJXQlRO",
  //     callbackURL: "http://localhost:3000/"

  //   },
  //   function(token, tokenSecret, profile, done) {
  //     return done(e)
  //   }
  // );
