import { addGradientBorder } from "../leaflet-helpers.js";

export default function() {
 var section = d3.select(".all-state");
 
  //____________________________________________________________________________
  // Draw map
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
  map.scrollWheelZoom.disable();
  
  // add white gradient border
  var borderCanvas = addGradientBorder(map);
  map.on("fullscreenchange", function() {
    // hide transparency gradient when fullscreen
    borderCanvas.classed("hidden", map.isFullscreen());
    
    // when going from fullscreen to normal
    if (map.isFullscreen()) {
      map.setZoom(7);
      map.scrollWheelZoom.enable();
    } 
    else {
      // disable scroll zoom when in normal view
      map.scrollWheelZoom.disable();  
    }
  });
};