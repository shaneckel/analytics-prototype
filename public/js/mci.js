
// MCI

var ngMCI = angular.module("ngMCI",  ['ngRoute', 'ngAnimate' ]);

ngMCI.config(function($routeProvider, $locationProvider) {
  
  $routeProvider

    .when('/', {
      templateUrl: 'templ/index.html',
      resolve: {
        delay: function($q, $timeout) { // I will cause a 1 second delay
          var delay = $q.defer();
          $timeout(delay.resolve, 1000);
          return delay.promise;
        }
      }
    })

    .when('/:page', {
      templateUrl: 'templ/page.html',
      controller: PageCntl
     })

    .otherwise({
      templateUrl : "templ/404.html"
    });

});
 
Site.config(function ($routeProvider) {
  $routeProvider
    
    .when('/:page', {
      templateUrl: 'partials/page.html', 
      controller: 'RouteController'
    })
    
    .otherwise({redirectTo: '/home'});
});

function NavController ($scope, $rootScope, $http) {
   $http.get('data/nav.json').success(function (data) {
    $rootScope.pages = data;
  });

  // Set the slug for menu active class
  $scope.$on('routeLoaded', function (event, args) {
    $scope.page = args.page;
  });
}

function RouteController ($scope, $rootScope, $routeParams) {
  // Getting the slug from $routeParams
  var page = $routeParams.page;
  
  $scope.$emit('routeLoaded', {page: page});
  $scope.page = $rootScope.pages[page];
}

function MainCntl($scope, $route, $routeParams, $location) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
}
 
function BookCntl($scope, $routeParams) {
  $scope.name = "BookCntl";
  $scope.params = $routeParams;
}
 
function PageCntl($scope, $routeParams) {
  $scope.name = "ChapterCntl";
  $scope.params = $routeParams;
}