import { makeMapStatic, addGradientBorder } from "../leaflet-helpers.js";

export default function() {
  var section = d3.select(".milwaukee");

  var map = new L.Map(section.select(".map").node(), { 
      center: [43.15, -88.025], 
      zoom: 10,
      attributionControl: false
    });

  var layer = new L.TileLayer("tiles/{z}/{x}/{y}.png");

  map.addLayer(layer);
  makeMapStatic(map);
  addGradientBorder(map); 
};
