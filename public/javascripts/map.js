d3.json("libs/sf.json", function (sf) {

    var streets = topojson.feature(sf, sf.objects.streets),
    hoods = topojson.feature(sf, sf.objects.neighborhoods),
    arteries = topojson.feature(sf, sf.objects.arteries),
    freeways = topojson.feature(sf, sf.objects.freeways);
    console.log(hoods);
    //dimensions
    var w = 960,
    h = 860,
    scale = 350000,
    latitude = 37.7750,
    longitude = -122.4183,
    center = d3.geo.centroid(hoods);
    console.log(center);

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
 

 svg.selectAll(".subunit")
    .data(hoods.features)
  .enter().append("path")
    .attr("d", path);
});