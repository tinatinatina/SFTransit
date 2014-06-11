var AppController = angular.module('AppController', [ 'BusLocations', 'Bus.directives', 'ServiceRoutes', 'Bus.directives', 'ui.bootstrap']);
 
AppController.controller('homeCTRL', ['$scope', '$http', 'busMap', 'routeMap', 'xmlParser',
  function ($scope, $http, busMap, routeMap, xmlParser) {
    var w = 960,
    h = 860,
    scale = 350000,
    latitude = 37.7750,
    longitude = -122.4183,
    first = true;

    $scope.d3Data = [];
    $scope.routeList = [];
    $scope.routeItems = {};
    searchTag = "";

    makeMap();

function makeMap(){
    d3.json("libs/sf.json", function (sf) {

        var streets = topojson.feature(sf, sf.objects.streets),
        hoods = topojson.feature(sf, sf.objects.neighborhoods),
        arteries = topojson.feature(sf, sf.objects.arteries),
        freeways = topojson.feature(sf, sf.objects.freeways);

        var svg = d3.select("d3-Buses").append("svg")
        .attr("width", w)
        .attr("height", h);

        var projection = d3.geo.albers()
        .scale(scale) 
        .rotate([-longitude, 0]) 
        .center([0, latitude])
        .translate([w / 2, h/2.3]);

        var path = d3.geo.path()
            .projection(projection);
      

        svg.append("g")
          .selectAll(".hood")
          .data(hoods.features)
          .enter().append("path")
          .attr("d", path);
        d3.select("g").selectAll(".streets")
          .data(streets.features)
          .enter().append("path")
          .attr("d", path);

    });
}
  
    function makeLocationRequest(searchParam){
      busMap.getBusLocation(searchParam).then(function(result){
        $scope.d3Data = result;
      });
    }
    function makeRouteRequest(searchParam){
      routeMap.getRoutes(searchParam).then(function(routes){
        $scope.d3RouteData = routes;
        if(first){
          data = xmlParser.parse(routes);
          routes = data.getElementsByTagName("route");
                  if (routes) {
                    for (var i = 0; i < routes.length; i++) {
                      tag = routes[i].getAttribute("tag");
                      title = routes[i].getAttribute("title");
                      color = routes[i].getAttribute("color");
                      $scope.routeList.push(title);
                      $scope.routeItems[title] = {"tag": tag, "color":color};
                    }
                  }
          first = false;
        }
      });

    } 
    $scope.submitSearch = function(selected){
      if(selected === ""){
        searchTag = "";
      }else{
         searchTag = $scope.routeItems[selected].tag;
        
      }
      console.log(searchTag);
      searchRequest(searchTag);

    };
    function searchRequest(searchParam){
      makeLocationRequest(searchParam);
      makeRouteRequest(searchParam);
    }
    searchRequest(searchTag);

    $scope.d3RoutesOnClick = function(item){
      console.log('item',item);
    };
    setInterval(function(){
      console.log('setInt', searchTag);
      makeLocationRequest(searchTag);}, 15000);
    
}]);