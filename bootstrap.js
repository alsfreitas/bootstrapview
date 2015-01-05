var myFormatters = d3.locale({
      "decimal": ",",
      "thousands": ".",
      "grouping": [3],
      "currency": ["R$", ""],
      "dateTime": "%a %b %e %X %Y",
      "date": "%m/%d/%Y",
      "time": "%H:%M:%S",
      "periods": ["AM", "PM"],
      "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      "months": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      "shortMonths": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    });


    d3.format = myFormatters.numberFormat;
    numero = d3.format(",.$")

    var margin = {top: 20, right: 40, bottom: 30, left: 40};
    var WIDTH = 600 - margin.left - margin.right;
    var HEIGHT = 120 - margin.top - margin.bottom;

    Array.prototype.min = function () {
      return this.reduce(function (p, v) {
        return ( p.cx < v.cx ? p : v );
      });
    };

    var rect = {"x":margin.left, "y":20, "height":30, "width":80, "fill":"yellow", "opacity":0.5};

    Array.prototype.max = function () {
      return this.reduce(function (p, v) {
        return ( p.cx > v.cx ? p : v );

      });
    };

    var drawD3Document = function (data, canvas){

      console.log(canvas);
      var minimo = data.min().cx;
      var maximo = data.max().cx;

      var svg = d3.select("#"+canvas).append("svg")
      .attr("width", WIDTH + margin.left + margin.right)
      .attr("height", HEIGHT + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var div = d3.select("#"+canvas).append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

      console.log(minimo, maximo)

      data.forEach(function(d) {
        d.cx = +d.cx;
      });

var xValue = function(d) { return d.cx;}, // data -> value
xScale = d3.scale.linear().range([0, WIDTH]), // value -> display
xMap = function(d) { return xScale(xValue(d));}, // data -> display
xAxis = d3.svg.axis().scale(xScale).orient("bottom");

xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);

svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + HEIGHT + ")")
.call(xAxis)
.append("text")
.attr("class", "label")
.attr("x", WIDTH)
.attr("y", -6)
.style("text-anchor", "end");

svg.append("rect")
.attr('x', rect.x)
.attr('y', rect.y)
.attr('width', rect.width)
.attr('height', rect.height)
.attr('fill', rect.fill)
.attr('opacity', rect.opacity);

svg.selectAll("circle")
.data(data.sort(), function(d){return d.cx})
.enter()
.append("circle")
.attr("cx", function(d){return xMap(d)})
.attr("cy", function(d){return d.cy+20})
.attr("r", 4)
.style("fill", function(d){return d.color})
.on("mouseover", function(d) {
  div.transition()
  .duration(200)
  .style("opacity", .9);
  div .html("SALIC: "+d.salic+"<br/>"+"NOME: "+d.projeto+"<br/>"+"VALOR: "+numero(d.cx)+"<br/>")
  .style("left", (d3.event.pageX) + "px")
  .style("top", (d3.event.pageY - 40) + "px");})
.on("mouseout", function(d) {
  div.transition()
  .duration(500)
  .style("opacity", 0);

});
};
