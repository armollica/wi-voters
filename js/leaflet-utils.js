L.helpers = {};

(function() {
  L.helpers.makeMapStatic = makeMapStatic;
  L.helpers.makeMapInteractive = makeMapInteractive;
  L.helpers.addGradientBorder = addGradientBorder;
  
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

  function makeMapInteractive(map) {
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
    if (map.tap) map.tap.enable();
    d3.select(map._container).classed("static", false);
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
})()
