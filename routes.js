
//mci.js / routes

var _             = require('underscore'),
    path          = require('path'),
    passport      = require('passport'),
    flash         = require('connect-flash'),
    user          = require('./user.js'),
    userRoles     = require('./public/js/routingConfig').userRoles,
    accessLevels  = require('./public/js/routingConfig').accessLevels;
    db            = require('./db');

var routes = [
  
  //templ
  {
    path: '/templ/*',
    httpMethod: 'GET',
    middleware: [function (req, res) {
      var requestedView = path.join('./', req.url);
      res.render(requestedView);
    }],
    accessLevel: accessLevels.user
  },

  //api
  {
    path: '/api/clientInfo',
    httpMethod: 'GET',
    middleware: [function (req, res) {
       var clientInfo = db.clientInfo(function(rows){
        if(rows.length < 1){
          console.log('empty');
          res.json([{"empty" : "rows"}])
        }else{    
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify(rows)); 
        }
      });
    }],
    accessLevel: accessLevels.user
  },

  //auth
  {
    path: '/auth/google',
    httpMethod: 'GET',
    middleware: [passport.authenticate('google')]
  },
  {
    path: '/auth/google/return',
    httpMethod: 'GET',
    middleware: [passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/welcome',
      failureFlash: true
    })]
  },
  {
    path: '/auth/logout',
    httpMethod: 'GET',
    middleware: [function (req, res) {
      req.logout();
      res.clearCookie('user');
      console.log(" --- user logged out");
      res.render('index', { message: req.flash('logged out') });
    }]
  },

  //base
  {
    path: '/*',
    httpMethod: 'GET',
    middleware: [function(req, res) {
      var role = userRoles.public, username = '', email = '';
      if(req.user) {
        console.log("--- user " + req.user.username + " is valid." );
        role = req.user.role;
        username = req.user.username;
        email = req.user.email;
      }
      res.cookie('user', JSON.stringify({
        'username': username,
        'role': role,
        'email' : email,
        'title' : "user"
      }));  
      res.render('index', { message: req.flash('error') });
    }]
  }
];

module.exports = function(app) {
  _.each(routes, function(route) {
    route.middleware.unshift(ensureAuthorized);
    var args = _.flatten([route.path, route.middleware]);
    if(route.httpMethod.toUpperCase() === 'GET'){
      app.get.apply(app, args);
    }
  });
}

function ensureAuthorized(req, res, next) {
  var role;
    if(!req.user) role = userRoles.public;
    else role = req.user.role;
  var accessLevel = _.findWhere(routes, { path: req.route.path }).accessLevel || accessLevels.public;
    if(!(accessLevel.bitMask & role.bitMask)) return res.send(403);
  return next();
}