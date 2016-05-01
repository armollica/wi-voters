import { addGradientBorder } from "../leaflet-helpers.js";
import counties from "../data/wi-counties.json";
import countyNames from "../data/county-fips.json";

export default function() {
  var section = d3.select(".all-state");
 
  //____________________________________________________________________________
  // Draw map
  var map = new L.Map(section.select(".map").node(), { 
      center: [44.5856, -89.6347], 
      zoom: 8,
      maxZoom: 10,
      minZoom: 8,
      reuseTiles: true,
      maxBounds: [[47.2941, -86.4404], [41.8859, -93.2959]],
      attributionControl: false,
      fullscreenControl: true
    });

  var layer = new L.TileLayer("tiles/{z}/{x}/{y}.png");

  map.addLayer(layer); 
  map.scrollWheelZoom.disable();
  
  // add white gradient border
  var borderCanvas = addGradientBorder(map);
  map.on("fullscreenchange", function() {
    // hide transparency gradient when fullscreen
    borderCanvas.classed("hidden", map.isFullscreen());
    
    // when going from fullscreen to normal
    if (map.isFullscreen()) {
      map.setZoom(8);
      map.scrollWheelZoom.enable();
    } 
    else {
      // disable scroll zoom when in normal view
      map.scrollWheelZoom.disable();  
    }
  });
  
  //____________________________________________________________________________
  // County overlay for tooltip
  
  var matrix = d3.iconMatrix()
    .units(1000)
    .gap(6)
    .rows(8);
  
  var numberFormat = d3.format(","),
      percentFormat = d3.format("%");
  
  var svg = d3.select(map.getPanes().overlayPane).append("svg"),
      g = svg.append("g").attr("class", "leaflet-zoom-hide");
   
  var transform = d3.geo.transform({point: projectPoint}),
      path = d3.geo.path().projection(transform);
  
  var countyFeature = g.selectAll("path")
      .data(counties.features)
    .enter().append("path")
      .attr("class", "county")
      .on("mouseenter", addPictograph)
      .on("mouseleave", removePictograph);
  
  var iconMatrix = g.append("g").attr("class", "icon-matrix");
  iconMatrix.append("text").attr("class", "heading");
  iconMatrix.append("text").attr("class", "info");
  
  map.on("viewreset", reset);
  reset();
  
  function addPictograph(feature) {
    var props = feature.properties,
        democrats = props.GOVDEM14,
        republicans = props.GOVREP14,
        voters = props.GOVTOT14,
        independents = voters - democrats - republicans,
        eligibleVoters = props.PERSONS18,
        nonvoters = eligibleVoters - voters;
    
    var data = matrix([
        { key: "democrat", value: democrats },
        { key: "independent", value: independents },
        { key: "republican", value: republicans },
        { key: "non-voter", value: nonvoters }
      ]);
    
    var matrixWidth = data[data.length - 1].x,
        matrixMiddle = matrixWidth / 2, 
        bounds = path.bounds(feature),
        topLeft = bounds[0],
        bottomRight = bounds[1],
        boundsMiddle = (bottomRight[0] - topLeft[0])/2,
        x = bottomRight[0] + 10,
        y = topLeft[1] + (bottomRight[1] - topLeft[1])/2 - 25;
    
    // Flip matrix to the left for Milwaukee, Waukesha and Door Counties
    if ([55079, 55133, 55029].indexOf(+props.CNTY_FIPS) !== -1) {
      x = topLeft[0] - matrixWidth - 10;
    }
    
    // Slide matrix up if its too close to Illinois
    if ([55065, 55045, 55105, 55127, 55059].indexOf(+props.CNTY_FIPS) !== -1) {
      y -= +props.CNTY_FIPS === 55059 ? 40 : 20;
    }
    
    iconMatrix.classed("hidden", false);
    
    var icons = iconMatrix
      .attr("transform", "translate(" + x + "," + y + ")")
      .selectAll(".icon").data(data);
      
    icons.enter().append("circle")
      .attr("class", function(d) { return "icon " + d.key; });
    
    icons
      .attr("class", function(d) { return "icon " + d.key; })
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", 3);
      
    icons.exit().remove();
    
    
    iconMatrix.select(".heading")
      .attr("dx", -5)
      .attr("dy", -10)
      .text(countyNames[props.CNTY_FIPS]);
      
      
    var info = numberFormat(voters) + " voters. " 
      + "D: " + percentFormat(democrats/voters) + ". "
      + "R: " + percentFormat(republicans/voters) + ".";
    
    var tspan = iconMatrix.select(".info")
      .selectAll("tspan").data([
        numberFormat(voters) + " voters ",
        "D: " + percentFormat(democrats/voters) + " "
        + "R: " + percentFormat(republicans/voters) + ""
      ]);
    
    tspan.enter().append("tspan")
    tspan
      .attr("x", -5)
      .attr("y", 65)
      .attr("dy", function(d, i) { return i * 12; })
      .text(function(d) { return d; });
    tspan.exit().remove();
  }
  
  
  function removePictograph(d) {
    iconMatrix.classed("hidden", true);
  }
  
  function reset() {
    var bounds = path.bounds(counties),
        topLeft = bounds[0],
        bottomRight = bounds[1];
    
    svg
      .attr("width", bottomRight[0] - topLeft[0])
      .attr("height", bottomRight[1] - topLeft[1])
      .style("left", topLeft[0] + "px")
      .style("top", topLeft[1] + "px");
    
    g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
    
    countyFeature.attr("d", path);
  }
  
  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }
};