
//mci.js

var express   = require("express"),
    mysql     = require('mysql'),
    passport  = require('passport'),
    routes    = require('./routes'),
    path      = require("path");

var app = express();

var google_strategy = require('passport-google-oauth').OAuth2Strategy;

app.connect   = mysql.createConnection({
    host      : "analytics.c6wqovrzi8ft.us-east-1.rds.amazonaws.com", 
    user      : "analytics",
    password  : "rPTRGQPjwYBVCePb",
    database  : "analytics"
  });

app.configure(function () {
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });


routes.setup(app);

app.listen(3000);

console.log("---\nmci.js powered on.\n---")