
//mci.js

var express       = require('express'),
    passport      = require('passport'),
    flash         = require('connect-flash'),
    path          = require('path'),
    routes        = require('./routes'),
    user          = require('./user.js');

var app           = express();
  
app.configure(function () {
    app.set('views', __dirname + '/public/views');
    app.set('view engine', 'jade');    
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname + '/public')));
    app.use(express.cookieParser());
    app.use(express.cookieSession({secret: process.env.COOKIE_SECRET || "partytime" }));
    app.configure('development', 'production', function() {
      app.use(express.csrf());
      app.use(function(req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        next();
      });
    });
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.enable("jsonp callback");
    app.use(flash());
  });

app.use(passport.initialize());
app.use(passport.session());
passport.use(user.googleStrategy());
passport.serializeUser(user.serializeUser);
passport.deserializeUser(user.deserializeUser);

app.use(app.router);

require('./routes.js')(app);

app.listen(3000, function(){ console.log("\n--- mci.js powered on. ---\n") });
