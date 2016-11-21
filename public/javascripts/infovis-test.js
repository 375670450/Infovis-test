
var randColor = function () {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for( var i = 0; i < 6; i++ ){
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var choose = function (d) {
    d.chosen = !(d.chosen);
    d3.select("#row"+d.index)
        .transition()
        .duration(250)
        .style("background-color", function (d) {
            return d.chosen
                ? "blue"
                : "lightblue";
        })
    var point = d3.select("#point"+d.index);
    point.transition()
        .duration(250)
        .style("stroke-width", function (d) {
            return d.chosen
                ? "10px"
                : "0";
        });
}

var createChart = function (svg, data) {


    var margin = { top:20, right:20, bottom:20, left:40 },
        width = 640 - margin.left - margin.right,
        height = 480 - margin.top - margin.bottom;

    var chart = svg.append("g")
        .attr("transform","translate(" + margin.left + ", " + margin.top + ")");

    var xScale = d3.scaleLinear()
        .range([0, width]);
    var yScale = d3.scaleLinear()
        .range([height , 0]);

    xScale.domain([
        d3.min(data, function (point) {
            return point.x;
        }),
        d3.max(data, function (point) {
            return point.x;
        })
    ]).nice();
    yScale.domain([
        d3.min(data, function (point) {
            return point.y;
        }),
        d3.max(data, function (point) {
            return point.y;
        })
    ]).nice();

    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);

    chart.append("g")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis);

    chart.append("g")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)");

    return chart;
}

var createPoints = function (chart, data) {

// add points
    chart.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .attr("r", function (d) {
            return d.size;
        })
        .attr("fill", function (d) {
            return d.color;
        })
        .attr("id", function (d) {
            return "point" + d.index;
        })
        .style("stroke", function (d) {
            return d3.rgb(d.color).brighter(2)
        })
        .style("stroke-opacity", 0.5)
        .style("stroke-width", 0)
        .on("mouseover", function () {
            return d3.select(this)
                .attr("fill", function () {
                    return d3.rgb(
                        d3.select(this)
                            .style("fill"))
                        .darker(1);
                })
                .style("cursor", "hand")
        })
        .on("mouseout", function () {
            d3.select(this)
            //                        .transition()
            //                        .duration(250)
                .attr("fill", function (d) {
                    return d.color;
                })
                .style("cursor", "pointer");
        })
        .on("click", function (d) {
            choose(d);
        });
}

var createTable = function (data, columns) {
    var table = d3.select("#table-container")
        .append("table")
        .attr("border", "1")
        .attr("cellpadding", "5");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    table.append("col")
        .attr("width", "50");

    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .style("text-align", "center")
        .style("background-color", "lightgray")
        .text(function (d) {
            return d;
        });

    var rows = tbody
        .selectAll("tr")
        .data(data)
        .enter()
        .append("tr")
        .attr("id", function (d) {
            return "row" + d.index;
        })
        .style("background-color", "lightblue")
        .on("mouseover", function (d) {
            d3.select(this)
                .style("background-color", function () {
                    return d3.rgb(
                        d3.select(this)
                            .style("background-color"))
                        .darker(1);
                })
                .style("cursor", "hand");
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("background-color", d.chosen ? "blue" : "lightblue")
                .style("cursor", "pointer");
        })
        .on("click", function (d) {
            choose(d)
        });

    var cells = rows
        .selectAll("td")
        .data(function (row) {
            return columns.map(function (column) {
                return { column: column, value: row[column] };
            });
        })
        .enter()
        .append("td")
        .style("text-align", "center")
        .text(function (d) {
            return d.value;
        });
    return  table;
}

var dataset = d3.range(15).map(function () {
    var xv = Math.round(d3.randomUniform(20, 400)());
    var yv = Math.round(d3.randomUniform(20, 400)());
    var s = Math.round(d3.randomUniform(5, 20)());
    var c = randColor();
    return { x: xv, y:yv, size : s, color : c, chosen : false };
})

for(var i in dataset){
    dataset[i]["index"] = i;
}

var svg = d3.select("#chart-container")
    .append("svg")
    .attr("height", 640)
    .attr("width", 640);

var chart = createChart(svg, dataset);
createPoints(chart, dataset);
createTable(dataset, [ "x", "y", "size" ]);
