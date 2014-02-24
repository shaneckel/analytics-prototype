
// mci 

var ngMCI = angular.module("ngMCI", ['ngCookies', 'ngRoute', 'ngSanitize', 'ngCsv'])
  .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
    var access = routingConfig.accessLevels;

    // page specifics
    $routeProvider.when('/', {
        templateUrl: 'templ/home',
        controller: 'HomeCtrl',
        access: access.user
      });
    $routeProvider.when('/node', {
        templateUrl: 'templ/node',
        controller: 'DefaultCtrl',
        access: access.user
      });     
    $routeProvider.when('/android', {
        templateUrl: 'templ/android',
        controller: 'DefaultCtrl',
        access: access.user
      });
    $routeProvider.when('/ios', {
        templateUrl: 'templ/ios',
        controller: 'DefaultCtrl',
        access: access.user
      });
    $routeProvider.when('/device', {
        templateUrl: 'templ/device',
        controller: 'DefaultCtrl',
        access: access.user
      });


    // app constants
    $routeProvider.when('/404', {
        templateUrl: '404',
        controller: 'DefaultCtrl',
        access: access.public
      });

    $routeProvider.when('/welcome', {
        templateUrl: 'login',
        controller: 'LoginCtrl',
        access: access.public
      });
    $routeProvider.otherwise({redirectTo:'/404'}); 

    //init
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

  //on route change validity
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