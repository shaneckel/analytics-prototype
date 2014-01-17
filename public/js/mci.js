
// MCI 

var ngMCI = angular.module("ngMCI", ['ngCookies', 'ngRoute', 'ngAnimate'])

  .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    var access = routingConfig.accessLevels;
    console.log(access);

    $routeProvider.when('/', {
        templateUrl: 'home',
        controller: 'HomeCtrl',
        access: access.user
      });

    $routeProvider.when('/login', {
        templateUrl: 'login',
        controller: 'LoginCtrl',
        access: access.anon
      });

    $routeProvider.when('/data', {
        templateUrl: 'data',
        controller: 'DataCtrl',
        access: access.user
      });

    $routeProvider.when('/admin', {
        templateUrl: 'admin',
        controller: 'AdminCtrl',
        access: access.user
      });

    $routeProvider.when('/404', {
        templateUrl: '404',
        access: access.public
      });

    $routeProvider.otherwise({redirectTo:'/404'});

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push(function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401 || response.status === 403) {
            $location.path('/login');
            return $q.reject(response);
          } else {
            return $q.reject(response);
          }
        }
      }
    });
  }])

  .run(['$rootScope', '$location', '$http', 'Auth', function ($rootScope, $location, $http, Auth) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
      $rootScope.error = null;
      if (!Auth.authorize(next.access)) {
        if(Auth.isLoggedIn()) $location.path('/');
        else $location.path('/login');
      }
    });
  }]);

angular.module('ngMCI').directive('accessLevel', ['Auth', function(Auth) {
  return {
    restrict: 'A',
    link: function($scope, element, attrs) {
      var prevDisp = element.css('display')
          , userRole
          , accessLevel;

      $scope.user = Auth.user;
      $scope.$watch('user', function(user) {
        if(user.role)
          userRole = user.role;
        updateCSS();
      }, true);

      attrs.$observe('accessLevel', function(al) {
          if(al) accessLevel = $scope.$eval(al);
          updateCSS();
      });

      function updateCSS() {
        if(userRole && accessLevel) {
          if(!Auth.authorize(accessLevel, userRole))
            element.css('display', 'none');
          else
            element.css('display', prevDisp);
        }
      }
    }
  };
}]);

angular.module('ngMCI').directive('activeNav', ['$location', function($location) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var nestedA = element.find('a')[0];
      var path = nestedA.href;
      scope.location = $location;
      scope.$watch('location.absUrl()', function(newPath) {
        if (path === newPath || path === newPath + '/' || path + '/' === newPath) {
          element.addClass('active');
        } else {
          element.removeClass('active');
        }
      });
    }
  };
}]);

angular.module('ngMCI').factory('Auth', function($http, $cookieStore){

  var accessLevels  = routingConfig.accessLevels, 
      userRoles     = routingConfig.userRoles, 
      currentUser   = $cookieStore.get('user') || { username: '', role: userRoles.public };

  $cookieStore.remove('user');

  function changeUser(user) {
    _.extend(currentUser, user);
  };

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
      $http.post('/login', user).success(function(user){
        changeUser(user);
        success(user);
      }).error(error);
    },
    accessLevels: accessLevels,
    userRoles: userRoles,
    user: currentUser
  };
});

angular.module('ngMCI').factory('Users', function($http) {
  return {
    getAll: function(success, error) {
      $http.get('/users').success(success).error(error);
    }
  };
});

angular.module('ngMCI').controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
  $scope.user = Auth.user;
  $scope.userRoles = Auth.userRoles;
  $scope.accessLevels = Auth.accessLevels;

  $scope.logout = function() {
    Auth.logout(function() {
      $location.path('/login');
    }, function() {
      $rootScope.error = "Failed to logout";
    });
  };
}]);


angular.module('ngMCI').controller('LoginCtrl', ['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {
  $scope.rememberme = true;

  $scope.loginOauth = function(provider) {
    $window.location.href = '/auth/' + provider;
  };
}]);
 
angular.module('ngMCI').controller('HomeCtrl', ['$rootScope', function($rootScope) {

}]);

angular.module('ngMCI').controller('DataCtrl',['$rootScope', function($rootScope) {

}]);