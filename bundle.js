(function () {
  'use strict';

  function makeMapStatic(map) {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
    d3.select(map._container).classed("static", true);
  }

  function addGradientBorder(map, borderWidth, borderColor) {
    var container = d3.select(map._container),
        width = +container.style("width").replace("px", ""),
        height = +container.style("height").replace("px", ""),
        borderWidth = borderWidth || 50,
        borderColor = borderColor || "#fff";
    
    var canvas = container.append("canvas")
      .attr("class", "gradient-border")
      .attr("width", width)
      .attr("height", height);
    
    var context = canvas.node().getContext("2d");
    
    var gradientData = [
          { 
            side: "left", x: 0, y: 0, dx: borderWidth, dy: height,
            gradient: context.createLinearGradient(0, 0, borderWidth, 0) 
          },
          { 
            side: "top", x: 0, y: 0, dx: width, dy: borderWidth,
            gradient: context.createLinearGradient(0, 0, 0, borderWidth) 
          },
          { 
            side: "right", x: width - borderWidth, y: 0, dx: borderWidth, dy: height,
            gradient: context.createLinearGradient(width, 0, width - borderWidth, 0) 
          },
          { 
            side: "bottom", x: 0, y: height - borderWidth, dx: width, dy: borderWidth,
            gradient: context.createLinearGradient(0, height, 0, height - borderWidth) 
          },
        ];
        
    gradientData.forEach(function(d) {
      d.gradient.addColorStop(0, borderColor);
      d.gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      context.fillStyle = d.gradient;
      context.fillRect(d.x, d.y, d.dx, d.dy);
    });
    
    return canvas;
  }

  function renderAllState() {
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
        map.setZoom(7);
        map.scrollWheelZoom.enable();
      } 
      else {
        // disable scroll zoom when in normal view
        map.scrollWheelZoom.disable();  
      }
    });
    
    // Remove mouse events from text container
    section.select(".text-container")
      .style("pointer-events", "none");
  };

  function renderMilwaukee() {
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

  function renderMadison() {
    var section = d3.select(".madison");

    var map = new L.Map(section.select(".map").node(), { 
        center: [43.074032, -89.33], 
        zoom: 10,
        attributionControl: false
      });

    var layer = new L.TileLayer("tiles/{z}/{x}/{y}.png");

    map.addLayer(layer);
    makeMapStatic(map);
    addGradientBorder(map);
  }

  function renderFoxValley() {
    var section = d3.select(".fox-valley");

    var map = new L.Map(section.select(".map").node(), { 
        center: [44.28, -88.275], 
        zoom: 10,
        attributionControl: false
      });

    var layer = new L.TileLayer("tiles/{z}/{x}/{y}.png");

    map.addLayer(layer);
    
    makeMapStatic(map);
    addGradientBorder(map);
  }

  //renderTitle();
  renderAllState();
  renderMilwaukee();
  renderMadison();
  renderFoxValley();

}());