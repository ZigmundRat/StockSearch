function price_chart(data)
{		    
			  var symbol=data["symbol"]; 	
			  var volume_array=data["json_volume"];
			  var price_array=data["json_price"];
			  var today=data["today"];
			  var split= today.split('-');
			  today= split[1]+'-'+split[2]+'-'+split[0];
			  var price_max=null, price_min=Number.POSITIVE_INFINITY, volume_max=null, volume_min=Number.POSITIVE_INFINITY;
			for(i in price_array)
			  {
				  if(price_min>price_array[i])
				  {
					  price_min=price_array[i];
				  }
				  if(price_max<price_array[i])
				  {
						price_max=price_array[i];
				  }
			  }  
			  for(i in volume_array)
			  {
				  if(volume_min>volume_array[i])
				  {
					  volume_min=volume_array[i];
				  }
				  if(volume_min<volume_array[i])
				  {
						volume_max=volume_array[i];
				  }
			  }
			  var options={
				  title: {
					text: 'Stock Price ('+today+')'  
				  },
				  subtitle:{
					  text: '<a href="https://www.alphavantage.co/" style="color:#0000FF;"> Source: Alpha Vantage </a>'
				  },
				  chart: {
					  renderTo: 'container_1',
					  alignTicks: true,
					  zoomType:'xy'
					  //,marginRight: 150
				  },
				  xAxis:{
					  //type: 'datetime',
					   tickInterval: 5,
					  categories: [],
					  //tickInterval: 24 * 3600 * 1000 * 7
				  },
				  legend: {
						align: 'center',
						verticalAlign: 'bottom',
						layout: 'horizontal',
				},
				  yAxis:[{
					  tickAmount:10,
					  tickInterval:35000000,
					  min:volume_min,
					  max:volume_max,
					  opposite:true,
					  gridLineWidth: 0,
					  title:{ 
					  text: 'Volume',
					  }
				  },
				  {
					  min:price_min,
					  max:price_max,
					  title:{ 
					  text: 'Stock Price'
					  }
				  }],
				  series:[]
			  };
					
			  options.series.push({});
			  options.series[0].name = symbol+" Price";
			  options.series[0].data=[];
			  options.series[0].type="area";
			  options.series[0].color="#add8e6";
			  options.series[0].yAxis=1;
			  options.series[0].fillOpacity=0.6;
			  var j=0;
					for (var i in price_array) {
							//options.xAxis.categories[130-j]=i;
							options.series[0].data[130-j] = Number(price_array[i]);
							if(j==130)
							{
								break;
							}
							j++;
						}
			  options.series.push({});
			  options.series[1].name = symbol+" Volume";
			  options.series[1].data=[];
			  options.series[1].type="column";
			  options.series[1].color="#ff0000";
			   j=0;
					for (var i in volume_array) {
							options.xAxis.categories[130-j]=i.substring(5,i.length);
							options.series[1].data[130-j] = Number(volume_array[i]);
							if(j==130)
							{
								break;
							}
							j++;
						}
			  var chart = new Highcharts.Chart(options);	
			  
			  
	  }
	  
	function draw_chart_indicators(type, data)
	{
		var name=data[type]["name"];
		var symbol=data["symbol"]; 	
		var indicator_type= data[type]["type"];
		var options_1={
		  title: {
			text: name  
		  },
		  subtitle:{
			 text: '<a href="https://www.alphavantage.co/" style="color:#0000FF;"> Source: Alpha Vantage </a>'
		  },
		  legend: {
			 align: 'center',
			 verticalAlign: 'bottom',
			 layout: 'horizontal',
		   },
		  chart: {
			    renderTo: 'container_1',
				type: 'line',
				zoomType:'xy'
		  },
		  xAxis:{
			  tickInterval: 5,
			  categories: []
		  },
		  yAxis:{
			  title:{ 
			  text: type,
			  }
		  },
		  plotOptions: {
			series: {
				marker: {
                  enabled: true,
				  symbol: "circle",
			      radius: 2.5
            }
        }
    },
		  series:[]
	  };
	  options_1.series.push({});
	  options_1.series[0].name = symbol;
	  options_1.series[0].data=[];
	  //options_1.series[0].dashStyle="dot";
	  options_1.series[0].color='#000000';
	  //options.series[0].type="line";
	   var j=0;
			for (var i in indicator_type) {
					options_1.xAxis.categories[130-j]=i.substring(5,i.length);
					options_1.series[0].data[130-j] = Number(indicator_type[i]);
					
					if(j==130)
					{
								break;
					}
					j++;
				}
	  
	  var chart = new Highcharts.Chart(options_1);	
	}
	function draw_chart_stoch(type, data)
	{
		var name=data[type]["name"];
		var symbol=data["symbol"]; 	
		var indicator_type= data[type];
		
		var options_1={
		  title: {
			text: name  
		  },
		  subtitle:{
			  text: '<a href="https://www.alphavantage.co/" style="color:#0000FF;"> Source: Alpha Vantage </a>'
		  },
		  chart: {
			    renderTo: 'container_1',
				type: 'line',
				zoomType:'xy'
				//marginRight: 150
		  },
		  legend: {
			align: 'center',
			verticalAlign: 'bottom',
			layout: 'horizontal',
		  },
		  xAxis:{
			  tickInterval: 5,
			  categories: []
		  },
		  yAxis:{
			  title:{ 
			  text: type,
			  }
		  },
		  plotOptions: {
			series: {
				marker: {
                  enabled: true,
				  symbol: "circle",
			      radius: 2.5
				}
			}
		},
		  series:[]
	  };
	  options_1.series.push({});
	  options_1.series[0].name = symbol +' SlowK';
	  options_1.series.push({});
	  options_1.series[1].name =symbol+' SlowD';
	  options_1.series[0].data=[];
	  options_1.series[1].data=[];
	  //options.series[0].type="line";
	   var j=0;
			for (var i in indicator_type['SlowK']) {
					options_1.xAxis.categories[130-j]=i.substring(5,i.length);
					options_1.series[0].data[130-j] = Number(indicator_type['SlowK'][i]);
					options_1.series[1].data[130-j] = Number(indicator_type['SlowD'][i]);
					
					if(j==130)
					{
								break;
					}
					j++;
				}
	  var chart = new Highcharts.Chart(options_1);	
	}
	function draw_chart_bbands(type,symbol)
	{
		var name=data[type]["name"];
		var symbol=data["symbol"]; 	
		var indicator_type= data[type];
		
		var options_1={
		  title: {
			text: name  
		  },
		  subtitle:{
			 text: '<a href="https://www.alphavantage.co/" style="color:#0000FF;"> Source: Alpha Vantage </a>'
		  },
		  legend: {
			align: 'center',
			verticalAlign: 'bottom',
			layout: 'horizontal',
		},
		  chart: {
			    renderTo: 'container_1',
				type: 'line',
				zoomType:'xy'
				//marginRight: 150
		  },
		  xAxis:{
			  tickInterval: 5,
			  categories: []
		  },
		  yAxis:{
			  title:{ 
			  text: type,
			  }
		  },
		  plotOptions: {
			series: {
				marker: {
                  enabled: true,
				  symbol: "circle",
			      radius: 2.5
				}
			}
		},
		  series:[]
	  };
	  options_1.series.push({});
	  options_1.series[0].name =symbol+' Real Lower Band';
	  options_1.series.push({});
	  options_1.series[1].name =symbol+' Real Middle Band';
	  options_1.series.push({});
	  options_1.series[2].name =symbol+' Real Upper Band';
	  options_1.series[0].data=[];
	  options_1.series[1].data=[];
	  options_1.series[2].data=[];
	  //options.series[0].type="line";
	   var j=0;
			for (var i in indicator_type['RealLowerBand']) {
					options_1.xAxis.categories[130-j]=i.substring(5,i.length);
					options_1.series[0].data[130-j] = Number(indicator_type['RealLowerBand'][i]);
					options_1.series[1].data[130-j] = Number(indicator_type['RealMiddleBand'][i]);
					options_1.series[2].data[130-j] = Number(indicator_type['RealUpperBand'][i]);
					
					if(j==130)
					{
								break;
					}
					j++;					
				}
	  var chart = new Highcharts.Chart(options_1);	
	}
	function draw_chart_macd(type)
	{
		var name=data[type]["name"];
		var symbol=data["symbol"]; 	
		var indicator_type= data[type];
		var options_1={
		  title: {
			text: name  
		  },
		  subtitle:{
			  text: '<a href="https://www.alphavantage.co/" style="color:#0000FF;"> Source: Alpha Vantage </a>'
		  },
		  legend: {
			align: 'center',
			verticalAlign: 'bottom',
			layout: 'horizontal',
		  },
		  chart: {
			    renderTo: 'container_1',
				type: 'line',
				zoomType:'xy'
				//marginRight: 150
		  },
		  xAxis:{
			  tickInterval: 5,
			  categories: []
		  },
		  yAxis:{
			  title:{ 
			  text: type,
			  }
		  },
		  plotOptions: {
			series: {
				marker: {
                  enabled: true,
				  symbol: "circle",
			      radius: 2.5
				}
			}
		},
		  series:[]
	  };
	  options_1.series.push({});
	  options_1.series[0].name =symbol+' MACD';
	  options_1.series.push({});
	  options_1.series[1].name =symbol+' MACD_Signal';
	  options_1.series.push({});
	  options_1.series[2].name =symbol+' MACD_HIST';
	  options_1.series[0].data=[];
	  options_1.series[1].data=[];
	  options_1.series[2].data=[];
	  //options.series[0].type="line";
	   var j=0;
			for (var i in indicator_type['MACD']) {
					options_1.xAxis.categories[130-j]=i.substring(5,i.length);
					options_1.series[0].data[130-j] = Number(indicator_type['MACD'][i]);
					options_1.series[1].data[130-j] = Number(indicator_type['MACD_Signal'][i]);
					options_1.series[2].data[130-j] = Number(indicator_type['MACD_Hist'][i]);
					if(j==130)
					{
								break;
					}
					j++;
				}
	  var chart = new Highcharts.Chart(options_1);	
	}