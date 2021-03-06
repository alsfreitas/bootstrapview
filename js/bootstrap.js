Array.prototype.unique = function()
{
  var n = {},r=[];
  for(var i = 0; i < this.length; i++)
  {
    if (!n[this[i].cx])
    {
      n[this[i].cx] = true;
      r.push(this[i]);
    }
  }
  return r;
}

myFormatters = d3.locale({
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
  formatador_numero = d3.format(",.2f$")

var drawD3Document = function (retorno, canvas, indice){

  var ESCALA_ZOOM = [1, 16]

  var margin = {top: 20, right: 20, bottom: 100, left: 30};
  var SVG_WIDTH = parseInt(d3.select('#canvas1').style('width'), 10)
  var SVG_HEIGHT = 200
  var WIDTH = SVG_WIDTH - margin.left - margin.right;
  var HEIGHT = SVG_HEIGHT - margin.top - margin.bottom;
  var HEIGHT_X_AXIS = 0.8*HEIGHT
  var CIRCLES_Y = 0.15*HEIGHT
  var BOOTSTRAP_Y = 0.35*HEIGHT
  var BOOTSTRAP_HEIGHT = 0.3*HEIGHT
  var TICK_SIZE = -HEIGHT_X_AXIS/8
  var numOfticks = 20
  var data = retorno.pontos.slice()

  data.forEach(function(d) {
    d.cx = +d.valor;
    d.cy = CIRCLES_Y;
    d.color = "blue";
  });

  data.push({'cx': $("#"+canvas).attr('data-custo-item'), 'cy': CIRCLES_Y, 'color': "red"})

  data.sort(function(a,b){
    return a.cx - b.cx;
  });

  var rect = {"x":retorno.limitesBootstrap[0], "y":BOOTSTRAP_Y, "height": BOOTSTRAP_HEIGHT, "x2":retorno.limitesBootstrap[1], "fill":"yellow", "opacity":0.5};

  var unicos = data.unique()
  for(var i = 0; i<unicos.length; i++){
    for(var j = 0; j<data.length; j++){
      if(unicos[i].cx == data[j].cx){
        if(!unicos[i].html){
          unicos[i].html = "CUSTO: "+formatador_numero(data[j].cx)+"<br/>"
        }
        if(data[j].nomeProjeto  || data[j].salic || data[j].salic){
          unicos[i].html += "<br/>PROJETO: "+data[j].nomeProjeto+"<br/>"+"SALIC: "+data[j].salic+"<br/>"+"FSA: "+data[j].fsa+"<br/>";
        }
      }
    }
  }

  var xScale = d3.scale.linear().domain([data[0].cx, data[data.length-1].cx]).range([0, WIDTH]);
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(numOfticks).tickSize(TICK_SIZE);

  var zoom = d3.behavior.zoom()
  .x(xScale)
  .scaleExtent(ESCALA_ZOOM)
  .on("zoom", zoomed)

  var svg = d3.select("#"+canvas).append("svg")
  .attr("width", SVG_WIDTH)
  .attr("height", SVG_HEIGHT)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .call(zoom);

  var div = d3.select("#"+canvas).append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

   svg.append("rect")
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', function(d){return xScale(data[data.length-1].cx)-xScale(data[0].cx)})
  .attr('height', SVG_HEIGHT)
  .attr('fill', "green")
  .attr('opacity', 0)
  .attr("class", "rect1")
   .on("mousedown", function(d) {
    div.transition()
    .duration(500)
    .style("opacity", 0);
  });

  svg.append("g")
  .attr("class", "x axis")
  .attr("id", "x"+indice)
  .attr("transform", "translate(0, "+HEIGHT_X_AXIS+")")
  .call(xAxis)
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.6em")
    .attr("dy", ".50em")
    .attr("transform", function(d) {
      return "translate(0, "+0+")"+"rotate(-65)"
     });

  //  svg.append("g")
  // .attr("class", "labelX")
  // .append("text")
  // .text("Custo em  "+ESCALA+" Reais")
  // .attr("class", "label")
  // .attr("x", WIDTH/2-50)
  // .attr("y", HEIGHT+40)
  // .style("text-anchor", "center");



  svg.append("rect")
  .attr('x', function(d){return xScale(+rect.x)})
  .attr('y', rect.y)
  .attr('width', function(d){return xScale(rect.x2)-xScale(rect.x)})
  .attr('height', rect.height)
  .attr('fill', rect.fill)
  .attr('opacity', rect.opacity)
  .attr("class", "rect2")
  .on("mousedown", function(d) {
    div.transition()
    .duration(500)
    .style("opacity", 0);
  });

  svg.selectAll("circle")
  .data(unicos)
  .enter()
  .append("circle")
  .attr("cx", function(d){return xScale(d.cx)})
  .attr("cy", function(d){return d.cy+30})
  .attr("r", 4)
  .attr("class", "circle"+indice)
  .style("fill", function(d){return d.color})
  .on("click", function(d) {
    div.html(d.html)
    .transition()
    .duration(200)
    .style("opacity", .9)
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 40) + "px");
  })
  // .on("click", function(d) {
  //   div.transition()
  //   .duration(500)
  //   .style("opacity", 0);
  // });

  function zoomed() {

    var fator = zoom.scale()
    var xScale = d3.scale.linear().domain([data[0].cx, data[data.length-1].cx]).range([0, fator*WIDTH]);
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(numOfticks).tickSize(-HEIGHT_X_AXIS/8);

    var minX = -fator*WIDTH
    var scrollMaxParaEsquerda = minX + WIDTH
    var scrollMaxDaDireita = -fator*WIDTH + WIDTH
    var scrollMaxDaEsquerda = 0

    var tx = zoom.translate()[0]

    if(tx > scrollMaxDaEsquerda){
        tx = scrollMaxDaEsquerda
    }else if(tx < scrollMaxDaDireita){
        tx = scrollMaxDaDireita
    }

    svg.select("#x"+indice).call(xAxis).attr("transform", "translate(" + tx + ", "+HEIGHT_X_AXIS+")scale(1)")

    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.6em")
    .attr("dy", ".5em")
    .attr("transform", function(d) {
        return "rotate(-65)"
    });
    svg.selectAll("circle").attr("cx", function(d){return xScale(d.cx)}).attr("transform", "translate(" + tx + ", 0)scale(1)");
    svg.select(".rect1").attr('x', 0).attr('width', xScale(data[data.length-1].cx)-xScale(data[0].cx)).attr("transform", "translate(" + tx+",0)scale(1)");
    svg.select(".rect2").attr('x', function(d){return xScale(rect.x)}).attr('width', xScale(rect.x2) - xScale(rect.x)).attr("transform", "translate(" + tx +",0)scale(1)");

      }
    };
