var ESCALA = 1000

var myFormatters = d3.locale({
  "decimal": ",",
  "thousands": ".",
  "grouping": [3],
  "currency": ["R$", ""],
  "dateTime": "%a %b %e %X %Y",
  "date": "%m/%d/%Y",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
  "shortDays": ["Dom", "Seg", "Ter", "Qua", "qui", "Sex", "Sab"],
  "months": ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembo", "Outubro", "Novembro", "Dezembro"],
  "shortMonths": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dec"]
});


d3.format = myFormatters.numberFormat;
numero = d3.format(",.$")

var margin = {top: 20, right: 10, bottom: 50, left: 10};
var WIDTH = 600 - margin.left - margin.right;
var HEIGHT = 160 - margin.top - margin.bottom;
var rect = {"x":2500/ESCALA, "y":40, "height":30, "x2":6500/ESCALA, "fill":"yellow", "opacity":0.5};

var drawD3Document = function (data, canvas){

  data.forEach(function(d) {
    d.cx = +d.cx/ESCALA;
  });

  data.sort(function(a,b){
    return a.cx - b.cx;
  });

  console.log(data.map(function(x,y){return x.cx}));

  xScale = d3.scale.linear().domain([data[0].cx, data[data.length-1].cx]).range([0, WIDTH]);
  xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(-HEIGHT/8);

  var zoom = d3.behavior.zoom()
  .x(xScale)
  .scaleExtent([1, 2.5])
  .on("zoom", zoomed)

  var svg = d3.select("#"+canvas).append("svg")
  .attr("width", WIDTH + margin.left + margin.right)
  .attr("height", HEIGHT + margin.top + margin.bottom)
  .append("g")
  .attr("class", "cont")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .call(zoom);


  var div = d3.select("#"+canvas).append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + HEIGHT + ")")
  .call(xAxis)
  .append("text")
  .text("bla")
  .attr("class", "label")
  .attr("x", WIDTH)
  .attr("y", 20)
  .style("text-anchor", "end");

  svg.append("rect")
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', function(d){return xScale(data[data.length-1].cx)-xScale(data[0].cx)})
  .attr('height', HEIGHT)
  .attr('fill', "blue")
  .attr('opacity', 0)
  .attr("class", "rect1");

  svg.append("rect")
  .attr('x', function(d){return xScale(+rect.x)})
  .attr('y', rect.y)
  .attr('width', function(d){return xScale(rect.x2)-xScale(rect.x)})
  .attr('height', rect.height)
  .attr('fill', rect.fill)
  .attr('opacity', rect.opacity)
  .attr("class", "rect2");

  svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", function(d){return xScale(d.cx)})
  .attr("cy", function(d){return d.cy+40})
  .attr("r", 4)
  .style("fill", function(d){return d.color})
  .on("mouseover", function(d) {
    div.transition()
    .duration(200)
    .style("opacity", .9);
    div.html("SALIC: "+d.salic+"<br/>"+"NOME: "+d.projeto+"<br/>"+"VALOR: "+numero(d.cx*ESCALA)+"<br/>")
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 40) + "px");
  })
  .on("mouseout", function(d) {
    div.transition()
    .duration(500)
    .style("opacity", 0);
  });

  wheel1 = 1
  wheel2 = 1
  width = 1
  function zoomed() {
    wheel2 = d3.event.scale
    //console.log("1: "+ wheel1 + "      2: " + wheel2)
    if(wheel2 > wheel1){
      width += 0.25
      if(width > 2.5){
        width =2.5
      }
    }else if(wheel1 > wheel2){
      width -= 0.25
      if(width < 1){
        width = 1
      }
    }
    xScale = xScale.range([0, width*WIDTH]);
    wheel1 = wheel2
    //svg.select(".x.axis").attr("transform", "translate(" + d3.event.translate[0] + ", "+HEIGHT+")scale(" + 1 + ")");
        // svg.select(".x.axis").attr("transform", "translate(" + d3.event.translate[0] + ", "+HEIGHT+")scale(" + d3.event.scale + ")");
        // svg.selectAll("circle").attr("transform", "translate(" + d3.event.translate+" )scale(" + d3.event.scale + ")");
        // svg.select("rect").attr("transform", "translate(" + d3.event.translate+" )scale(" + d3.event.scale + ")");

    var tx = d3.event.translate[0]
    //console.log(svg.select(".x.axis"));
    svg.select(".x.axis").call(xAxis).attr("transform", "translate(" + tx + ", "+HEIGHT+")scale(1)");
    svg.selectAll("circle").attr("cx", function(d){return xScale(d.cx)}).attr("transform", "translate(" + tx + ", 0)scale(1)");
    svg.select(".rect1").attr('x', 0).attr('width', xScale(data[data.length-1].cx)-xScale(data[0].cx)).attr("transform", "translate(" + tx+",0)scale(1)");
    svg.select(".rect2").attr('x', function(d){return xScale(rect.x)}).attr('width', xScale(rect.x2) - xScale(rect.x)).attr("transform", "translate(" + tx+",0)scale(1)");


      }
    };
