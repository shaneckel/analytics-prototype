 
// mci's controllers

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

  .controller('DefaultCtrl',['$rootScope','$scope', function($rootScope, $scope) {
    $rootScope.loadStatus = "complete";
  }])
  
  .controller('Pdf',['$rootScope', '$scope', function($rootScope, $scope) {
    $scope.generatePDF = function() {
      console.log('here')
    }
  }]);
  
