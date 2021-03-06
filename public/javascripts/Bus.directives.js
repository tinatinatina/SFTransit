
angular.module('Bus.directives', [])
  .directive('d3Buses', ['$window', '$q', 'xmlParser', function($window, $q, xmlParser) {

      return {
        restrict: 'EA',
        scope: {

          data: '=',
          label: "@",
          onClick: '&'
        },

        link: function(scope, element, attrs) {

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

              var w = 960,
              h = 860,
              scale = 350000,
              latitude = 37.7750,
              longitude = -122.4183;

                  var busList = {"type": "GeometryCollection","geometries": [],"transform":{"scale":[0.000015799650249758944,0.000012629319171253285],"translate":[-122.51494757948463,37.70701707795974]}},
                  buses = data.getElementsByTagName("vehicle");
                  if (buses) {
                    for (var i = 0; i < buses.length; i++) {
                        var route = buses[i].getAttribute("routeTag"),
                        system = buses[i].ownerDocument.URL.split("&a=")[1],
                        lat = buses[i].getAttribute("lat"),
                        lon = buses[i].getAttribute("lon"),
                        bus = {"type": "Point", "coordinates": [lon, lat], "route": [system, route]};
                        busList.geometries.push(bus);
                    }
                  }


                  var projection = d3.geo.albers()
                  .scale(scale) 
                  .rotate([-longitude, 0]) 
                  .center([0, latitude])
                  .translate([w / 2, h/2.3]);
                  
                  d3.select('svg').selectAll('circle').remove();

                  var color = {
                    'sf-muni': 'blue',
                    'actransit': 'red'
                  };

                  var path = d3.geo.path()
                      .projection(projection);

                  d3.select('svg')
                    .selectAll('circle')
                    .data(busList.geometries)
                    .enter()
                    .append('circle')
                    .attr("transform", function(d) { 
                      return "translate(" + projection(d.coordinates) + ")"; 
                  })
                    // .attr("class", function(d) { return d.route[0];})
                    .attr("id", function(d) { return d.route[1];})
                    .attr("r", 2)
                    .style("fill", "white")
                    .style({
                      "stroke":"black", "stroke-width":2
                    });
                    d3.selectAll('circle')
                    .on('mouseover', function(){
                        d3.select(this).enter().append("text")
                        .text(function(d) {return d.id;})
                        .attr("x", function(d) {return x(d.x);})
                        .attr("y", function (d) {return y(d.y);});
                      });
                  

              // }makeVehicleList(data);
            };

          // }); //d3 promise
          // }); //wordcount promise
        }
      };

  }]);