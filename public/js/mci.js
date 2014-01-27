
// MCI 

var ngMCI = angular.module("ngMCI", ['ngCookies', 'ngRoute'])
  .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
    var access = routingConfig.accessLevels;

    $routeProvider.when('/', {
        templateUrl: 'templ/home',
        controller: 'HomeCtrl',
        access: access.user
      });

    $routeProvider.when('/welcome', {
        templateUrl: 'login',
        controller: 'LoginCtrl',
        access: access.public
      });

    $routeProvider.when('/data', {
        templateUrl: 'templ/data',
        controller: 'DefaultCtrl',
        access: access.user
      });

    $routeProvider.when('/404', {
        templateUrl: '404',
        controller: 'DefaultCtrl',
        access: access.public
      });

    $routeProvider.otherwise({redirectTo:'/404'});
    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push(function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401 || response.status === 403) {
            $location.path('/welcome');
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
      $rootScope.loadStatus = "working";
      $rootScope.error = null;
 
      if (!Auth.authorize(next.access, undefined)) {
        if(Auth.isLoggedIn()) $location.path('/');
        else $location.path('/welcome');
      }
    });
  }]);


//Directive
angular.module('ngMCI')
  .directive('accessLevel', ['Auth', function(Auth) {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        var prevDisp = element.css('display'), 
            userRole, 
            accessLevel;

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
  }])

  .directive('activeNav', ['$location', function($location) {
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


//Factory
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

  
//Controller
angular.module('ngMCI')
  .controller('NavCtrl', ['$rootScope', '$scope', '$location','$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    $scope.logout = function() {
      Auth.logout(function() {
       $window.location.href ='/welcome';
      }, function() {
        $rootScope.error = "Failed to logout";
      });
    };

  }])

  .controller('LoginCtrl', ['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {
    $rootScope.loadStatus = "complete";
    if(Auth.isLoggedIn()) $location.path('/');

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  }])
 
  .controller('HomeCtrl', ['$rootScope', '$scope', '$http',
    function($rootScope, $scope, $http) {
      $rootScope.loadStatus = "working";
      $http.get('/api/clientInfo').success(function(data) {
        $scope.datapass = data;
        $rootScope.loadStatus = "complete";
       })
    }])  
 
  .controller('DefaultCtrl',['$rootScope', function($rootScope) {
    $rootScope.loadStatus = "complete";
  }]);