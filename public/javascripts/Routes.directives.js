angular.module('Routes.directives', [])
  .directive('d3Routes', ['$window', '$q', 'xmlParser', function($window, $q, xmlParser) {

      return {
        restrict: 'EA',
        scope: {

          data: '=',
          label: "@",
          onClick: '&'
        },

        link: function(scope, element, attrs) {

          // d3Service.d3().then(function(d3) {
            console.log("d3 done");
           


            window.onresize = function(){
              scope.$apply();
            };

            scope.$watch(function() {
              return angular.element($window)[0].innerWidth;
            }, function() {
              scope.render(scope.data);
            });
            scope.$watch('data', function(newVals, oldVals) {
              return scope.render(newVals);
              }, true);
            
            scope.render = function(data) {
              data = xmlParser.parse(data);
              console.log('RoutesDir');

              var w = 960,
              h = 860,
              scale = 350000,
              latitude = 37.7750,
              longitude = -122.4183;


                  var routesList = {"type": "FeatureCollection","features": [],"transform":{"scale":[0.000015799650249758944,0.000012629319171253285],"translate":[-122.51494757948463,37.70701707795974]}},
                  routes = data.getElementsByTagName("route");
                  if (routes) {
                    for (var i = 0; i < routes.length; i++) {
                        route = {"type": "Feature", "properties":{}, "geometry": {"type":"MultiLineString", "coordinates": []}};
                        route.properties.tag = routes[i].getAttribute("tag");
                        route.properties.color = routes[i].getAttribute("color");
                        paths = routes[i].getElementsByTagName("path");
                        for (var j = 0; j < paths.length; j++) {
                          var pathway = paths[j];
                          var lines = [];
                          for (var k = 0; k < pathway.children.length; k++) {
                            var lat = pathway.children[k].getAttribute("lat");
                            var lon = pathway.children[k].getAttribute("lon");
                            lines.push([lon, lat]);
                          } route.geometry.coordinates.push(lines);
                        }
                        routesList.features.push(route);
                    }
                  }
                  console.log('routeslist', routesList.features);

                  var projection = d3.geo.albers()
                  .scale(scale) 
                  .rotate([-longitude, 0]) 
                  .center([0, latitude])
                  .translate([w / 2, h/2.3]);

                  var path = d3.geo.path()
                      .projection(projection);
               
                  d3.select("g")
                    .selectAll("routes")
                    .data(routesList.features)
                    .enter().append("path")
                    .attr("d", path)
                    .style("stroke", function(d) {
                                //Get data value
                                var value = d.properties.color;

                                if (value) {
                                        //If value exists…
                                        return value;
                                } else {
                                        //If value is undefined…
                                        return "#ccc";
                                }
                   }).style("stroke-width", "2")
                    .style("fill", "none");
            };
        }
      };

  }]);