
// mci's data points

angular.module('ngMCI')

  .factory('Auth', function($http, $cookieStore){
    var accessLevels  = routingConfig.accessLevels, 
        userRoles     = routingConfig.userRoles, 
        currentUser   = $cookieStore.get('user') || { username: '', role: userRoles.public };

    $cookieStore.remove('user');

    return {
      authorize: function(accessLevel, role) {
        if(role === undefined)
          role = currentUser.role;
        return accessLevel.bitMask & role.bitMask;
      },
      isLoggedIn: function(user) {

        if(user === undefined)
          user = currentUser;
        return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
      },
      login: function(user, success, error) {
        $http.post('/welcome', user).success(function(user){
          changeUser(user);
          success(user);
        }).error(error);
      },
      logout: function(success, error) {
        $http.get('/auth/logout').success(function(){
          user = {
            username: '',
            role: userRoles.public
          };
          success(user);
        }).error(error);
      },
      accessLevels: accessLevels,
      userRoles: userRoles,
      user: currentUser
    };
  })