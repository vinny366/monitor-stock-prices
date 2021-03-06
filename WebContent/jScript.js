
//http://bl.ocks.org/mbostock/3883195
var companyName;
var companyHistory;
var companyFullName;
var reloadGraph = function(){
	
	companyName = $("#company_code").val();
	companyHistory = undefined;	
	var urlFromData = "http://localhost:8080/MonitorStockPrice/rest/yahoostocks/company_history/"+companyName;


	$.ajax({
		url: urlFromData,
		type: "GET",
		dataType: 'JSON',
		success: function (data) {
			parsedData = JSON.parse(data)
			companyHistory = parsedData.stockHistory;
			companyFullName = parsedData.company_fullName;
		},
		async: false
	});
	
	
	    
	    
	
	
	
	
	if(companyHistory.length !=0){
		
		$("#graph").html("");		
		$("#graph").append("<u><h4 style='text-align:center;margin-top:50px'>"+ companyFullName +" Stocks History </h4></u>");
	    var margin = {top: 20, right: 20, bottom: 30, left: 50},
	    width = 950 - margin.left - margin.right,
	    height = 300 - margin.top - margin.bottom;
	    		
		var svg = d3.select("#graph").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		var maxValue;
		var minValue;
		var minTimeStamp;
		var maxTimeStamp;
		for(var i=0; i<companyHistory.length; i++){
			if(maxValue == undefined){
				maxValue = companyHistory[i].stockPrice;
			}
			
			else if(companyHistory[i].stockPrice > maxValue){
				maxValue = companyHistory[i].stockPrice;
			}
			
			if(minValue == undefined){
				minValue = companyHistory[i].stockPrice;				
			}
			else if(companyHistory[i].stockPrice < minValue){
				minValue = companyHistory[i].stockPrice;
			}			
			
			if(minTimeStamp == undefined){
				minTimeStamp = companyHistory[i].timestamp;
			}
			else if(companyHistory[i].timestamp < minTimeStamp){
				minTimeStamp = companyHistory[i].timestamp;				
			}
			
			if(maxTimeStamp == undefined){
				maxTimeStamp = companyHistory[i].timestamp;
			}
			else if(companyHistory[i].timestamp > maxTimeStamp){
				maxTimeStamp = companyHistory[i].timestamp;
			}
		}
				
		
		var x = d3.time.scale()
	    	.range([0, width])
	    	.domain([minTimeStamp,maxTimeStamp]);
		
		
		var y = d3.scale.linear()
				.rangeRound([0,height])
				.domain([maxValue+0.5, minValue-0.5]);
	
		var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");
		
		var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");
		
	
		svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

		svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Stock Value ($)");

		
		var area = d3.svg.area()
	    .x(function(d) { return x(d.timestamp); })
	    .y0(height)
	    .y1(function(d) { return y(d.stockPrice); });
		
				
		svg.append("path")
	      .datum(companyHistory)
	      .attr("class", "area")
	      .attr("d", area);
    	
		
		var div = d3.select(".mouseOverContent");
		svg.selectAll("circle").data(companyHistory)
			.enter()
			.append("circle")			
			.attr("cx",function(d){				
				return x(d.timestamp);
			})
			.attr("cy",function(d){				
				return y(d.stockPrice);
			})
			.attr("r",function(d){
				return 3;
			})
			.style("stroke", "black")
			.style("fill", "white")
			.style("fill-opacity","0.01")
			.on("mouseover", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div .html("<b><h5>Stock Price: " + d.stockPrice + "<br>" + "Time: " + d.time + "<br></h5 </b>")
                    .style("left", (d3.event.pageX - 100) + "px")
                    .style("top", (d3.event.pageY - 75) + "px")
                    .style("color","black");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", 0);
            })
							
	}
	else{
		alert("invalid company name or company does not exist in database");
	}
	
	
} 

var createChart = function(){
	
}

