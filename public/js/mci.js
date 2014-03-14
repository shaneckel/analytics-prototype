
// mci 

var ngMCI = angular.module("ngMCI", ['ngCookies', 'ngRoute', 'ngSanitize', 'ngCsv'])
  .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    var access = routingConfig.accessLevels;

    // page specifics
    $routeProvider.when('/', {
        redirectTo: '/client'
      });

    $routeProvider.when('/client', {
        templateUrl: 'templ/clientlist',
        controller: 'ClientListCtrl',
        access: access.user
      });     

    $routeProvider.when('/#/client/test', {
        templateUrl: 'templ/client',
        controller: 'ClientCtrl'
        //,
        //access: access.user
      });     

    $routeProvider.when('/hotlist', {
        templateUrl: 'templ/hotlist',
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

    // $httpProvider.interceptors.push(function($q, $location) {
    //   //  return {
    //   //   'responseError': function(response) {
    //   //     if(response.status === 401 || response.status === 403) {
    //   //       $location.path('/welcome');
    //   //       return $q.reject(response);
    //   //     } else {
    //   //       return $q.reject(response);
    //   //     }
    //   //   }
    //   // }
    // });
  }])

  //on route change validity
  // .run(['$rootScope', '$location', '$http', 'Auth', function ($rootScope, $location, $http, Auth) {  

  //   $rootScope.$on("$routeChangeStart", function (event, next, current) {
      
  //     $rootScope.loadStatus = "working";
  //     $rootScope.error = null;

  //    //  if(next.access !== undefined){
  //    //    if (!Auth.authorize(next.access, undefined)) {

  //    //      if(Auth.isLoggedIn()){
  //    //        $location.path('/');
  //    //      }else{
  //    //        $location.path('/welcome');
  //    //      } 

  //    //    }else{
  //    //      console.log("why em I here");
  //    //    }
  //    // }
  //   });
  // }]);