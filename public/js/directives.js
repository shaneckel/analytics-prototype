
// mci's directives

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
          console.log(newPath);
          console.log("! - " + path);
          if (path === newPath || path === newPath + '/' || path + '/' === newPath) {
            element.addClass('active');
          } else {
            element.removeClass('active');
          }
        });
      }
    };
  }])
  
  .directive('generateCsv', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        scope.get_csv = function () {  
          return scope.datapass;      
        };
      },
      template: '<a href="#" ng-csv="get_csv()" filename="bb_data.csv"> Export to CSV </a>'
    }
  })

  .directive('generatePdf', ['$location', '$http', function($location,$http) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.on('click',function() {

          $http.post('generate/pdf',  scope.datapass, {responseType: 'blob'}).success(function(data) { //create pdf
            var blob = new Blob([data], {type: 'application/pdf'})
              , url = URL.createObjectURL(blob)
              , pom = document.createElement('a');
            pom.setAttribute('href', url);
            pom.setAttribute('download', 'out.pdf');
            pom.click(); 
          });
        });
      }
    };
  }]);

