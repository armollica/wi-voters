import { addGradientBorder } from "../leaflet-helpers.js";
import counties from "../data/wi-counties.json";
import countyNames from "../data/county-fips.json";

export default function() {
  var section = d3.select(".map-section");
 
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
  
  //____________________________________________________________________________
  // Legend
  
  var legendData = {
    header: [
      {
        text: ["Sparsely", "Populated"],
        x: 10
      },
      {
        text: ["Densely", "Populated"],
        x: 70
      }
    ],
    population: [
        { 
          text: "Heavily Democrat",
          color: "#446093",
          densities: [0.1, 0.3, 0.6, 1]
        },
        { 
          text: "Close Contest",
          color: "#874e8e",
          densities: [0.1, 0.3, 0.6, 1] 
        },
        { 
          text: "Heavily Republican",
          color: "#bc3939",
          densities: [0.1, 0.3, 0.6, 1]
        }
    ],
    icon: [
      { text: "Democrats (1000 per circle)", key: "democrat" },
      { text: "Republicans", key: "republican" },
      { text: "Independents", key: "independent" },
      { text: "Non-voters (18+ years old)", key: "non-voter" }
    ]
  };
  
  var legend = d3.select(".map-container").append("svg")
      .attr("class", "legend")
      .attr("width", 1200)
      .attr("height", 1600)
    .append("g")
      .attr("transform", "translate(20, 1350)");
  
  // Population legend
  var populationLegend = legend.append("g")
    .attr("class", "population");
  
  var barHeaders = populationLegend.append("g")
        .attr("class", "bar-header")
        .attr("transform", "translate(0,-20)")
        .selectAll(".header").data(legendData.header)
      .enter().append("g")
        .attr("transform", function(d) { return "translate(" + d.x + ",0)"; });
  
  barHeaders.selectAll("text").data(function(d) { return [d]; })
    .enter().append("text")
      .selectAll("tspan").data(function(d) { return d.text; })
    .enter().append("tspan")
      .attr("x", 0)
      .attr("dy", function(d, i) { return 12*i; })
      .style("text-anchor", "middle")
      .text(function(d) { return d; });
  
  barHeaders.selectAll("line").data(function(d) { return [d]; })
    .enter().append("line")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 14)
      .attr("y2", 20);
  
  var bars = populationLegend.selectAll(".bar").data(legendData.population)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d, i) { return "translate(0," + (i*18) + ")"; })
      .style("fill", function(d) { return d.color; });
  
  bars.selectAll("rect").data(function(d) { return d.densities; })
    .enter().append("rect")
      .attr("x", function(d, i) { return i * 20; })
      .attr("width", 20)
      .attr("height", 15)
      .style("opacity", function(d) { return d; });
  
  bars.selectAll("text").data(function(d) { return [d.text]; })
    .enter().append("text")
      .attr("dx", 85)
      .attr("dy", 12)
      .style("fill", null)
      .text(function(d) { return d; });
  
  // Icon legend
  var iconLegend = legend.append("g")
    .attr("class", "icon")
    .attr("transform", "translate(0, 75)");
  
  var icons = iconLegend.selectAll(".icon").data(legendData.icon)
    .enter().append("g")
      .attr("class", "icon")
      .attr("transform", function(d, i) { return "translate(0," + (16*i) + ")"; });
  
  icons.selectAll("circle").data(function(d) { return [d]; })
    .enter().append("circle")
      .attr("class", function(d) { return d.key; })
      .attr("r", 3);
  
  icons.selectAll("text").data(function(d) { return [d]; })
    .enter().append("text")
      .attr("dx", 9)
      .attr("dy", 4)
      .text(function(d) { return d.text; });
};