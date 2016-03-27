(function() {
  
  var section = d3.select(".madison");

  var map = new L.Map(section.select(".map").node(), { 
      center: [43.074032, -89.33], 
      zoom: 10,
      attributionControl: false
    });

  var layer = new L.TileLayer("tiles/{z}/{x}/{y}.png");

  map.addLayer(layer); 
  
  L.helpers.makeMapStatic(map);
  
  L.helpers.addGradientBorder(map);
})()
