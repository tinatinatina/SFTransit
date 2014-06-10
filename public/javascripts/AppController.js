var AppController = angular.module('AppController', [ 'BusLocations', 'Bus.directives', 'ServiceRoutes', 'Bus.directives']);
 
AppController.controller('homeCTRL', ['$scope', '$http', 'busMap', 'routeMap', 'xmlParser',
  function ($scope, $http, busMap, routeMap, xmlParser) {
    var w = 960,
    h = 860,
    scale = 350000,
    latitude = 37.7750,
    longitude = -122.4183,
    first = true;

    $scope.d3Data = [];
    $scope.d3RouteData = "hi mom";
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
    // var zoom = d3.behavior.zoom()
    //     .on("zoom",function() {
    //         svg.attr("transform","translate("+ 
    //             d3.event.translate.join(",")+")scale("+d3.event.scale+")");
    //         svg.selectAll("path")  
    //             .attr("d", path.projection(projection)); 
    // });

    // svg.call(zoom);
    });
}
  

    function makeRequest(searchParam){
      busMap.getBusLocation(searchParam).then(function(result){
          $scope.d3Data = result;
      });
      routeMap.getRoutes(searchParam).then(function(routes){
          $scope.d3RouteData = routes;
          if(first){
            $scope.searchRoutes = routes;
            first = false;
          }
      });
    }

    makeRequest();
    
}]);