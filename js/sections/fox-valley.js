(function() {
  
  var section = d3.select(".fox-valley");

  var map = new L.Map(section.select(".map").node(), { 
      center: [44.313344, -88.293021], 
      zoom: 10,
      attributionControl: false
    });

  var layer = new L.TileLayer("tiles/{z}/{x}/{y}.png");

  map.addLayer(layer);
  
  L.helpers.makeMapStatic(map);
  L.helpers.addGradientBorder(map);
})()
