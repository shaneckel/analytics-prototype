
//mci.js / user

var _               = require('underscore'),
    passport        = require('passport'),
    googleStrategy  = require('passport-google').Strategy,
    userRoles       = require('./public/js/routingConfig').userRoles,
    db              = require('./db');
    users           = [{id: 1, username: "admin_user", password: "PrMAtfw8tyvSpfbc", role: userRoles.user}];

module.exports = {

  findOrCreateOauthUser: function(provider, providerId, rows) {
    var user = module.exports.findByProviderId(provider, providerId);
    if(!user) {
      user = {
        id: _.max(users, function(user) { return user.id; }).id + 1,
        username: rows[0].firstName || '',
        email: rows[0].email,
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
      realm: process.env.GOOGLE_REALM || ""
    },
    function(identifier, profile, done) {
      var dbCheck = db.validateUser(profile.emails[0].value, function(rows){
        if(rows.length < 1){
          console.log("--- failed auth");
          done(null, false, { 
            message: "I'm sorry but "+ profile.emails[0].value + " isn't on the list." 
          });
        }else{
          var user = module.exports.findOrCreateOauthUser('google', identifier, rows);
          done(null, user);
        }
      })
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