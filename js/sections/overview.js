(function() {
  
  var section = d3.select(".overview");

  var map = new L.Map(section.select(".map").node(), { 
      center: [44.5856, -89.6347], 
      zoom: 7,
      maxZoom: 10,
      minZoom: 7,
      reuseTiles: true,
      maxBounds: [[47.2941, -86.4404], [41.8859, -93.2959]],
      attributionControl: false,
      fullscreenControl: true
    });

  var layer = new L.TileLayer("tiles/{z}/{x}/{y}.png");

  map.addLayer(layer); 
  
  // add white gradient border
  var borderCanvas = L.helpers.addGradientBorder(map);
  map.on("fullscreenchange", function() {
    // hide transparency gradient when fullscreen
    borderCanvas.classed("hidden", map.isFullscreen());
    // zoom all the way out
    map.setZoom(7);
  });
  
})()

