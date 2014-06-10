var angApp = angular.module('AngApp', [
  'ngRoute', 'd3', 'AppController', 'Bus.directives', 'Routes.directives',
  'ServiceRoutes', 'xml'
]);

// angApp.factory('getRequestParams',
// }]);


angApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'client/views/home.html',
        controller: 'homeCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);