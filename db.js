
//mci.js / db

var _               = require('underscore'),
    mysql           = require('mysql'),
    connect         = mysql.createConnection({
      host          : 'analytics.c6wqovrzi8ft.us-east-1.rds.amazonaws.com',
      user          : 'analytics',
      password      : 'rPTRGQPjwYBVCePb',
      database      : 'analytics'
    });

module.exports = {
  
  validateUser : function(oAuthUser, callback){
    var q = "SELECT id, sub, email, isActive, isBrander, firstName, lastName FROM users WHERE email = '" + oAuthUser + "' LIMIT 1;";
    connect.query(q ,
      function(err,rows,fields){
        callback(rows);
      });
  },
  
  clientInfo : function(callback){
    var q = "SELECT clientID, clientName, isCommerce, isDefunct, mobile, tablet, desktop, iphoneApp, ipadApp, androidApp, hasMobilePVVRatio, hasTabletPVVRatio, hasAndroidAppPVVRatio, hasIphoneAppPVVRatio FROM availableClientProfiles ORDER BY clientName;";
    connect.query(q, 
      function(err,rows,fields){
        callback(rows);
      });
  }
}
