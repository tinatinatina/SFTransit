angular.module('ServiceRoutes', ["AngApp"])
  .factory('routeMap', function($http, $q) {
  var routes;
  var routeResults = function(){return routes;};
  var getRoutes = function(args){
    var tag = '';
    if(args !== ""){
      tag = '&r='+args;
    }
    console.log('ServiceRoutes', args, tag);
    var deferred = $q.defer();    
    $http({
      method: 'GET',
      url: "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=sf-muni"+tag,
      responseType: 'application/xml'
    })
        .success(function(data, status, headers, config){
          console.log("DATA FETCHED");
          deferred.resolve(data);
          routes = data;
        })
        .error(function(data, status, headers, config){
          console.log('get error in getTweets');
          deferred.reject();
        });

      return deferred.promise;
  };


  return {getRoutes: getRoutes,
    routeResults: routeResults
  };
});
 