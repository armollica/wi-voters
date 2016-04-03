export default function() {
  var section = d3.select(".title")
    .style("positon", "relative");
    
  var clipPath = section.append("svg")
        .attr("width", 0)
        .attr("height", 0)
      .append("defs")
      .append("clipPath")
        .attr("id", "title-clip-text")
      .append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", "50px")
        .attr("font-weight", 700)
        .attr("x", 0)
        .attr("y", 20)
        .attr("textLength", 920 - 40 + "px")
        .attr("lengthAdjust", "spacing")
        .text("Voters of Wisconsin");
        
  var backgroundImg = section.append("img")
    .attr("src", "img/header-background.png");
  
 
  
  
};