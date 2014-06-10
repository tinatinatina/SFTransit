var w = 960,
h = 860,
scale = 350000,
latitude = 37.7750,
longitude = -122.4183,
first = true;


d3.json("libs/sf.json", function (sf) {

    var streets = topojson.feature(sf, sf.objects.streets),
    hoods = topojson.feature(sf, sf.objects.neighborhoods),
    arteries = topojson.feature(sf, sf.objects.arteries),
    freeways = topojson.feature(sf, sf.objects.freeways);

    var svg = d3.select("body").append("svg")
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
      .attr("d", path)
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

console.log('aftermap');
function text_xml(tag) {
    realXmlUrl = "http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a="+tag;
    http_request = false;
    http_request = new XMLHttpRequest();
    if (http_request.overrideMimeType) {
        http_request.overrideMimeType('text/xml');
    }

    http_request.onreadystatechange = this.response_xml;
    http_request.open('GET', realXmlUrl, true);
    http_request.send(null);
    xmlDoc = http_request.responseXML; // this doesn't have anything
}
function response_xml() {
    if (self.http_request.readyState == 4) {
        console.log(" Done!");
        console.log(http_request.responseXML);
        makeVehicleList(http_request.responseXML);
    }
}

function makeVehicleList(xml) {
    var busList = {"type": "GeometryCollection","geometries": [],"transform":{"scale":[0.000015799650249758944,0.000012629319171253285],"translate":[-122.51494757948463,37.70701707795974]}},
    buses = xml.getElementsByTagName("vehicle");
    console.log('buses',buses);
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
    console.log('buslist', busList);
    plotVehicles(busList);
}

function plotVehicles(list){
  var first = false;
  console.log('list1',list);
    // var w = 960,
    // h = 860,
    // scale = 350000,
    // latitude = 37.7750,
    // longitude = -122.4183,
    // center = d3.geo.centroid(hoods);

    projection = d3.geo.albers()
    .scale(scale) 
    .rotate([-longitude, 0]) 
    .center([0, latitude])
    .translate([w / 2, h/2.3]);
    
    d3.select('svg').selectAll('.'+list.geometries[0].route[0]).remove();

    var color = {
      'sf-muni': 'blue',
      'actransit': 'red'
    };

    var path = d3.geo.path()
        .projection(projection);

    d3.select('svg')
      .selectAll('circle')
      .data(list.geometries)
      .enter()
      .append('circle')
      .attr("transform", function(d) { 
        return "translate(" + projection(d.coordinates) + ")"; 
    })
      .attr("class", function(d) { return d.route[0];})
      .attr("id", function(d) { return d.route[1];})
      .attr("r", 2)
      .style("fill", function(d) {
        return color[d.route[0]];
      });
   // });
}
  text_xml('actransit');
  text_xml('sf-muni');
setInterval(function(){
  text_xml('actransit');
  text_xml('sf-muni');
  
}, 15000)
console.log('done');


