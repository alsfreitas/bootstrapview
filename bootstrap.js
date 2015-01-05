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

    var margin = {top: 20, right: 40, bottom: 30, left: 40};
    var WIDTH = 600 - margin.left - margin.right;
    var HEIGHT = 120 - margin.top - margin.bottom;
    var rect = {"x":margin.left, "y":20, "height":30, "width":80, "fill":"yellow", "opacity":0.5};

    var drawD3Document = function (data, canvas){

      data.forEach(function(d) {
        d.cx = +d.cx;
      });

      data.sort(function(a,b){
        return a.cx - b.cx;
      });

      console.log(data.map(function(x,y){return x.cx}));

      xScale = d3.scale.linear().domain([data[0].cx-1, data[data.length-1].cx+1]).range([0, WIDTH]);
      xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(-HEIGHT/8);

      var zoom = d3.behavior.zoom()
        .x(xScale)
        .scaleExtent([0.01, 10])
        .on("zoom", zoomed)

      var svg = d3.select("#"+canvas).append("svg")
        .attr("width", WIDTH + margin.left + margin.right)
        .attr("height", HEIGHT + margin.top + margin.bottom)
        .append("g")
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
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d){return xScale(d.cx)})
        .attr("cy", function(d){return d.cy+20})
        .attr("r", 4)
        .style("fill", function(d){return d.color})
        .on("mouseover", function(d) {
          div.transition()
          .duration(200)
          .style("opacity", .9);
          div.html("SALIC: "+d.salic+"<br/>"+"NOME: "+d.projeto+"<br/>"+"VALOR: "+numero(d.cx)+"<br/>")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 40) + "px");
        })
        .on("mouseout", function(d) {
          div.transition()
          .duration(500)
          .style("opacity", 0);
        });

      function zoomed() {
        svg.select(".x.axis").attr("transform", "translate(" + d3.event.translate[0] + ", "+HEIGHT+")scale(" + d3.event.scale + ")");
        svg.selectAll("circle").attr("transform", "translate(" + d3.event.translate+" )scale(" + d3.event.scale + ")");
        svg.select("rect").attr("transform", "translate(" + d3.event.translate+" )scale(" + d3.event.scale + ")");
      }
  };
