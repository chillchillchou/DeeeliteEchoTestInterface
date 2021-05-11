var svg = d3.select("svg"),
  margin = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 70
  },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom;

//text label for X-axis
svg.append("text")
  .attr("transform",
        "translate(" + (width/2) + " ," +
                       (height + margin.top + 35) + ")")
  .style("text-anchor", "middle")
  .text("Time");

//text label for Y-axis
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", margin.left-40)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Power");


let points = [
  [0, 0],
  [100, 100],
  [600, 100],
  [700, 0],
  [1000,0],
  [1100,40],
  [1500,40],
  [1600,0],
  [1800,0]

];



var x = d3.scaleLinear().domain([0, 10000]).range([0, width*0.9]);

var y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

var xAxis = d3.axisBottom(x),
  yAxis = d3.axisLeft(y);

function updateGraph() {
  var line = d3.line()
    .x(function(d) {
      return x(d[0]);
    })
    .y(function(d) {
      return y(d[1]);
    });

  let drag = d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);

  svg.append('rect')
    .attr('class', 'zoom')
    .attr('cursor', 'move')
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  var focus = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(points, function(d) {
    return d[0];
  }));
  y.domain(d3.extent(points, function(d) {
    return d[1];
  }));

  focus.append("path")
    .datum(points)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  focus.selectAll('circle')
    .data(points)
    .enter()
    .append('circle')
    .attr('r', 8.0)
    .attr('cx', function(d) {
      return x(d[0]);
    })
    .attr('cy', function(d) {
      return y(d[1]);
    })
    .style('cursor', 'pointer')
    .style('fill', 'steelblue')
    .call(drag);

  // focus.selectAll('circle')
  //   .call(drag);

  focus.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  focus.append('g')
    .attr('class', 'axis axis--y')
    .call(yAxis);

  function dragstarted(d) {
    d3.select(this).raise().classed('active', true);
  }

  function dragged(d) {
    d[0] = x.invert(d3.event.x);
    d[1] = y.invert(d3.event.y);
    d3.select(this)
      .attr('cx', x(d[0]))
      .attr('cy', y(d[1]))
    focus.select('path').attr('d', line);
  }

  function dragended(d) {
    d3.select(this).classed('active', false);
  }

}


//add new POINTS
function addPoints() {
  var numOfPoints = points.length;
  px = points[8][0];
  points.push([px + 500, 0]);
  console.log("button clicked");
  console.log(points[numOfPoints]);

}

updateGraph()
