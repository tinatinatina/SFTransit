angular.module('ServiceRoutes', ["AngApp"])
  .factory('routeMap', function($http, $q) {
  var routes;
  var routeResults = function(){return routes;};
  var getRoutes = function(args){
    var args = args || 'sf-muni';
    var deferred = $q.defer();
    var text_xml = function(tag) {
        realXmlUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a="+tag;
        http_request = false;
        http_request = new XMLHttpRequest();
        if (http_request.overrideMimeType) {
            http_request.overrideMimeType('text/xml');
        }

        http_request.onreadystatechange = this.response_xml;
        http_request.open('GET', realXmlUrl, true);
        http_request.send(null);
        xmlDoc = http_request.responseXML; // this doesn't have anything
    };
    var response_xml = function() {
        if (self.http_request.readyState == 4) {
            console.log(" Done!");
            console.log(http_request.responseXML);
            deferred.resolve(http_request.responseXML);
            routes = http_request.responseXML;
        }
    };
      text_xml(args);
      return deferred.promise;
  };


  return {getRoutes: getRoutes,
    routeResults: routeResults
  };
});
 