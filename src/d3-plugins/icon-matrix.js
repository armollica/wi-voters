d3.iconMatrix = function() {
  var rows = 5,
      gap = 10,
      units = 1,
      scale = d3.scale.linear(),
      widthFirst = false,
      key = function(d) { return d.key; },
      value = function(d) { return d.value; };
      
  function matrix(data) {
    scale
      .domain([0, rows - 1])
      .range([0, gap * rows]);
      
    var elements = data
      .map(function(d) {
        return d3.range(0, d.value / units)
          .map(function() { return key(d); });  
      })
      .reduce(function(a, b) { return a.concat(b); })
      .map(function(key, i) {
        
        var column = Math.floor(i / rows),
            row = i % rows;
            
        if (widthFirst) { 
          var r = row, c = column;
          row = c; 
          column = r;
        }
        
        return {
          key: key, row: row, column: column,
          x: scale(column),
          y: scale(row)
        };
        
      });
    
    return elements;
  }
  
  matrix.rows = function(_) {
    if (!arguments.length) return rows;
    rows = _;
    return matrix;
  };
  
  matrix.gap = function(_) {
    if (!arguments.length) return gap;
    gap = _;
    return matrix;
  };
  
  matrix.units = function(_) {
    if (!arguments.length) return units;
    units = _;
    return matrix;
  };
  
  matrix.key = function(_) {
    if (!arguments.length) return key;
    key = _;
    return matrix;
  };
  
  matrix.value = function(_) {
    if (!arguments.length) return value;
    value = _;
    return matrix;
  };
  
  matrix.widthFirst = function(_) {
    if (!arguments.length) return widthFirst;
    widthFirst = _;
    return matrix;
  };
  
  return matrix;
}