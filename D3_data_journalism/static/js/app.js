var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3
  .select('#scatter')
  .append('svg')
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("./D3_data_journalism/static/data/data.csv").then(function (stateData) {

  // Step 1: Parse Data/Cast as numbers
  // ==============================
  stateData.forEach(function (data) {
    data.poverty = + data.poverty;
    data.healthcare = + data.healthcare;
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData.map((d) => d["poverty"])) - 1,
    d3.max(stateData.map((d) => d["poverty"])) + 1.1])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData.map((d) => d["healthcare"])) - .5,
    d3.max(stateData.map((d) => d["healthcare"])) + 2])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Step 5: Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "12")
    .classed("stateCircle", true)

  // Step 6: Insert Circle Text
  // ==============================
  var circlesGroup = chartGroup.selectAll()
    .data(stateData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("dx", d => xLinearScale(d["poverty"]))
    .attr("dy", d => yLinearScale(d["healthcare"]) + 5)
    .classed("stateText", true);

  // Step 7: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
    });

  // Step 8: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Step 9: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  // Step 10: Create axis labels
  // ==============================
  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 50)
    .attr("x", 0 - (height / 2))
    .attr("value", "healthcare")
    .attr("dy", "1em")
    .classed("active", true)
    .text("Lacks healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .classed("active", true)
    .text("In Poverty (%)");
}).catch(function (error) {
  console.log(error);
});

