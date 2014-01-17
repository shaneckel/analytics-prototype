
//mci.js / routes

var _             = require('underscore'),
    path          = require('path'),
    passport      = require('passport'),
    user          = require('./user.js'),
    userRoles     = require('./public/js/routingConfig').userRoles,
    accessLevels  = require('./public/js/routingConfig').accessLevels;

var routes = [
  {
    path: '/templ/*',
    httpMethod: 'GET',
    middleware: [function (req, res) {
      var requestedView = path.join('./', req.url);
      res.render(requestedView);
    }],
    accessLevel: accessLevels.admin
  },
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
      failureRedirect: '/login'
    })]
  },
  {
    path: '/users',
    httpMethod: 'GET',
    middleware: [function(req, res) {
        var users = User.findAll();
        _.each(users, function(user) {
            delete user.password;
            delete user.twitter;
            delete user.facebook;
            delete user.google;
            delete user.linkedin;
        });
        res.json(users);
      }
    ],
    accessLevel: accessLevels.admin
  },
  {
    path: '/*',
    httpMethod: 'GET',
    middleware: [function(req, res) {
      var role = userRoles.public, username = '';
      if(req.user) {
        role = req.user.role;
        username = req.user.username;
      }
      res.cookie('user', JSON.stringify({
        'username': username,
        'role': role
      }));
      res.render('index');
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

    // switch(route.httpMethod.toUpperCase()) {
    //   case 'GET':
    //     app.get.apply(app, args);
    //     break;
    //   case 'POST':
    //     app.post.apply(app, args);
    //     break;
    //   case 'PUT':
    //     app.put.apply(app, args);
    //     break;
    //   case 'DELETE':
    //     app.delete.apply(app, args);
    //     break;
    //   default:
    //     throw new Error('Invalid HTTP method specified for route ' + route.path);
    //     break;
    // }

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