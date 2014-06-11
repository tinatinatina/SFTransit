angular.module('BusLocations', ["AngApp"])
  .factory('busMap', function($http, $q) {
  // $httpProvider.defaults.headers.post['Content-Type'] = 'text/xml';
  var buses;
  var busFinder = function(){return buses;};
  var getBusLocation = function(args){
    var deferred = $q.defer();
    var tag = '';
    if(args !== ""){
      tag = '&r='+args;
    }
    $http({
      method: 'GET',
      url:"http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=sf-muni"+tag,
      responseType: 'application/xml'
    })
        .success(function(data, status, headers, config){
          console.log("DATA FETCHED");
          deferred.resolve(data);
          buses = data;
        })
        .error(function(data, status, headers, config){
          console.log('get error in getTweets');
          deferred.reject();
        });
      return deferred.promise;
  };
    return {getBusLocation: getBusLocation,
    busFinder: busFinder
  };
});