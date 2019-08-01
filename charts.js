var inputData = [];
var pC;
var leg;
var worldData;

// The svg
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoNaturalEarth()
    .scale(width / 2 / Math.PI)
//.translate([width / 2, height / 2])
var path = d3.geoPath()
    .projection(projection);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
    .domain([1, 10, 50, 100, 200])
    .range(['lightgrey', 'green', 'lightgreen', 'orange', 'red']);

// Legend
var g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,20)");
g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("Happiness Ranking");
var labels = ['Not in scope', '1-10', '10-50', '50-100', '>100'];
var legend1 = d3.legendColor()
    .labels(function (d) {
        return labels[d.i];
    })
    .shapePadding(4)
    .scale(colorScale);
svg.select(".legendThreshold")
    .call(legend1);

// tooltip
var tooltip = d3.select("#my_chart")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background-color", "#D3D3D3")
    .style("border", "solid thin #fff");

// mouseover on map
function mouseover() {
    tooltip.style("visibility", "visible");
}

// mousemove on map
function mousemove(d) {
    var tooltipText;
    if (d.ladder > 0) {
        tooltipText = "Country: " + d.properties.name + "<br />" + "Rank: " + d.ladder;
    } else tooltipText = "Country: " + d.properties.name;
    tooltip.html(tooltipText)
        .style("top", (event.clientY - 10) + "px").style("left", (event.clientX + 10) + "px");
}

// mouseout on map
function mouseout() {
    tooltip.style("visibility", "hidden");
}


function chartClicked(d, i) {
    // filter for selected country based on ladder
    var st = inputData.filter(function (s) {
        return s.ladder == d.ladder;
    });
    var dataForPieChart = [];
    var attributes = ['corruption', 'freedom', 'generosity', 'healthyLifeExpectancy',
        'logOfGDperCapita', 'negativeAffect', 'positiveAffect', 'socialSupport'
    ];
    for (var item in attributes) {
        var key = attributes[item];
        if (st[0][key]) {
            let newObj = {};
            newObj.type = attributes[item];
            newObj.typeValue = st[0][key];
            dataForPieChart.push(newObj);
        }
    }

    var c = {};
    c.countryName = st[0].name;
    c.ladder = st[0].ladder;
    c.happinessScore = st[0].happinessScore;
    dataForPieChart.push(c);

    // update donut chart and the legend
    pC.update(dataForPieChart);
    leg.update(dataForPieChart);
}

// colour mapping for donut chart
function segColor(c) {
    return {
        corruption: "#377eb8",
        freedom: "#ff6e54",
        generosity: "#76D7C4",
        healthyLifeExpectancy: "#7aa6c2",
        logOfGDperCapita: "#984ea3",
        socialSupport: "#dd5182"
    } [c];
}

// Load external data and boot
function loadData(year) {
    document.getElementById("year").innerHTML = "Year " + year;

    // clearing the previous map and pie
    d3.selectAll("#my_map").remove();
    d3.selectAll("#map_Pie").remove();
    d3.selectAll("#map_legend").remove();

    var fileName;
    if (year == '2018') {
        fileName = "happiness-data-2018.csv";
    } else {
        fileName = "happiness-data-2019.csv";
    }
    inputData = [];
    data.clear();

    d3.queue()
        .defer(d3.json, "world.geojson")
        .defer(d3.csv, fileName, function (d) {
            inputData.push(d);
            data.set(d.code, +d.ladder);
        })
        .await(ready);

}

function ready(error, topo) {
    if (error) throw error;
    worldData = topo.features;
    // Draw the map
    svg.append("g")
        .attr("id", "my_map")
        .attr("class", "countries")
        .selectAll("path")
        .data(topo.features)
        .enter().append("path")
        .attr("fill", function (d) {
            // Pull data for this country
            d.ladder = data.get(d.id) || 0;
            // Set the color
            return colorScale(d.ladder);
        })
        .attr("d", path)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout)
        .on("click", chartClicked);

    var topCountryData = inputData.filter(function (s) {
        return s.ladder == '1';
    });

    var initialPieChartData = [];
    var attributes = ['corruption', 'freedom', 'generosity', 'healthyLifeExpectancy',
        'logOfGDperCapita', 'negativeAffect', 'positiveAffect', 'socialSupport'
    ];
    for (var item in attributes) {
        var key = attributes[item];
        if (topCountryData[0][key]) {
            let newObj = {};
            newObj.type = attributes[item];
            newObj.typeValue = topCountryData[0][key];
            initialPieChartData.push(newObj);
        }
    }
    var legendData = JSON.parse(JSON.stringify(initialPieChartData));
    var c = {};
    c.countryName = topCountryData[0].name;
    c.ladder = topCountryData[0].ladder;
    c.happinessScore = topCountryData[0].happinessScore;
    initialPieChartData.push(c);

    pC = pieChart(initialPieChartData);
    leg = legend(legendData);
}

// function to handle pieChart.
function pieChart(pD) {
    var pC = {},
        pieDim = {
            w: 300,
            h: 300
        };
    pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

    var pieSelection = d3.select(my_pie);
    // create svg for pie chart.
    var piesvg = pieSelection.select("svg")
        .attr("width", pieDim.w).attr("height", pieDim.h).append("g").attr("id", "map_Pie")
        .attr("transform", "translate(" + pieDim.w / 2 + "," + pieDim.h / 2 + ")");

    // create function to draw the arcs of the pie slices.
    var arc = d3.arc().outerRadius(pieDim.r - 10).innerRadius(pieDim.r - 50);

    // create a function to compute the pie slice angles.
    var pie = d3.pie().sort(null).value(function (d) {
        return d.typeValue;
    });

    var g = piesvg.selectAll("path").data(pie(pD)).enter().append("g");
    g.append("path").attr("d", arc)
        .each(function (d) {
            this._current = d;
        })
        .style("fill", function (d) {
            return segColor(d.data.type);
        });

    g.append("text")
        .attr("id", "countryText")
        .attr("text-anchor", "middle")
        .attr('font-size', '1em')
        .attr('y', 0)
        .attr('x', 2)
        .text("Country Name: " + pD[pD.length - 1].countryName);

    g.append("text")
        .attr("id", "ladderText")
        .attr("text-anchor", "middle")
        .attr('font-size', '1em')
        .attr('y', 20)
        .text("Rank: " + pD[pD.length - 1].ladder);

    g.append("text")
        .attr("id", "scoreText")
        .attr("text-anchor", "middle")
        .attr('font-size', '1em')
        .attr('y', 40)
        .text("Happiness Score: " + pD[pD.length - 1].happinessScore);

    // create function to update pie-chart.
    pC.update = function (nD) {
        piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
            .attrTween("d", arcTween);
        piesvg.selectAll("#countryText").text("Country Name: " + nD[nD.length - 1].countryName);
        piesvg.selectAll("#ladderText").text("Rank: " + nD[nD.length - 1].ladder);
        piesvg.selectAll("#scoreText").text("Happiness Score: " + nD[nD.length - 1].happinessScore)
    }

    // Re-drawing the pies 
    function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) {
            return arc(i(t));
        };
    }
    return pC;
}

function mapLegendsForPieChart(type) {
    var legendsForPieChart = ['Corruption', 'Freedom', 'Generosity', 'Healthy Life Expectancy',
        'GD per capita', 'Social Support'
    ];
    if (type == 'corruption') {
        return 'Corruption';
    } else if (type == 'freedom') {
        return 'Freedom';
    } else if (type == 'logOfGDperCapita') {
        return 'GD per capita';
    } else if (type == 'generosity') {
        return 'Generosity';
    } else if (type == 'socialSupport') {
        return 'Social Support';
    } else if (type == 'healthyLifeExpectancy') {
        return 'Healthy Life Expectancy';
    } else return null;
}

// Legend for Donut chart
function legend(lD) {
    var leg = {};

    // create table for legend.
    var legend = d3.select(my_pie).append("table").attr('class', 'legend').attr("id", "map_legend");

    // create one row per segment.
    var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

    // create the first column for each segment.
    tr.append("td").append("svg").attr("width", '25').attr("height", '16').append("rect")
        .attr("width", '16').attr("height", '16')
        .attr("fill", function (d) {
            return segColor(d.type);
        });

    // create the second column for each segment.
    tr.append("td").text(function (d) {
        return mapLegendsForPieChart(d.type);
    });

    // create the third column for each segment.
    tr.append("td").attr("class", 'legendFreq')
        .text(function (d) {
            return d3.format(",")(d.typeValue);
        });

    // Utility function to be used to update the legend.
    leg.update = function (nD) {
        // update the data attached to the row elements.
        var l = legend.select("tbody").selectAll("tr").data(nD);

        // update the frequencies.
        l.select(".legendFreq").text(function (d) {
            return d3.format(",")(d.typeValue);
        });
    }

    return leg;
}