
//mci.js

var application_root = __dirname,
    express = require("express"),
    mysql = require('mysql'),
    passport = require('passport'),
    path = require("path");

var app = express();

var connection = mysql.createConnection({
    host      : "analytics.c6wqovrzi8ft.us-east-1.rds.amazonaws.com", 
    user      : "analytics",
    password  : "rPTRGQPjwYBVCePb",
    database  : "analytics"
});

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/listclients', function (req, res) {
  connection.query('SELECT clientID, clientName, isCommerce, isDefunct, mobile, tablet, desktop, iphoneApp, ipadApp, androidApp, hasMobilePVVRatio, hasTabletPVVRatio, hasAndroidAppPVVRatio, hasIphoneAppPVVRatio FROM availableClientProfiles ORDER BY clientName;', function (error, rows, fields) { 
    res.writeHead(200, {'Content-Type': 'text/plain'});
    str='';
    for( i = 0; i < rows.length; i++ )
      str = str + rows[i].clientName +'\n';
      res.end(str);
  }); 
});

app.listen(9000);
