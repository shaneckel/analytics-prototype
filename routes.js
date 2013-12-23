function setup(app) {

  // app.get('/auth/google', handlers.auth.googleSignIn);
  // app.get('/auth/google/callback', handlers.auth.googleSignInCallback);

  // app.get('/api/user', handlers.user.getUsers);
  // app.get('/api/user/:id', handlers.user.getUser);


  app.get('/api/listclients', function (req, res) {

    query = 'SELECT clientID, clientName, isCommerce, isDefunct, mobile, tablet, desktop, iphoneApp, ipadApp, androidApp, hasMobilePVVRatio, hasTabletPVVRatio, hasAndroidAppPVVRatio, hasIphoneAppPVVRatio FROM availableClientProfiles ORDER BY clientName;';
    app.connect.query(query , function (error, rows, fields) { 
      res.writeHead(200, { 'Content-Type' : 'x-application/json' });
      json = JSON.stringify({
          fields : rows 
        });
      app.connect.end();
      res.end(json);
    }); 

  });

  app.get('/', function (req, res){
    res.writeHead(200,{'Content-Type' :'text/plain'});
    str = 'index';
    res.end(str);
  })

  console.log("\n| routes enabled");

};

exports.setup = setup;