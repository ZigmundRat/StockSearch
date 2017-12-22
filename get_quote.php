<?php
		header("Access-Control-Allow-origin: *");
		if (is_ajax()) {
			if (isset($_GET["action"]) && !empty($_GET["action"])) { //Checks if action value exists
			$action = $_GET["action"];
			switch($action) { //Switch case for value of action
				case "test": test_function(); break;
				case "indicators": indicators_function(); break; 
				//case "bbands": indicator_bbands(); break;
				}
			}
		}
		//Function to check if the request is an AJAX request
		function is_ajax() {
			return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
		}

		function test_function(){
				$SymName=$_GET["symbol"];
				$api_call="https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=".$SymName."&outputsize=full&apikey=UFOK9ERVB2YI6T65";
				$response = file_get_contents($api_call);
				$response= json_decode($response, true);
				date_default_timezone_set("America/New_York");
				$date=date("Y-m-d");
				$series=$response["Time Series (Daily)"];
				$first_value = reset($series);
				$close=$first_value["4. close"];
				$open=$first_value["1. open"];
				$volume=$first_value["5. volume"];
				$prev_day = next($series);
				$prev_close=$prev_day["4. close"];
				$change=$close-$prev_close;
				$change=number_format(round($change, 2),2);
				$change_percent=(($change/$prev_close)*100);
				$change_percent= number_format(round($change_percent, 2),2);
				//$range=$first_value["3. low"]-$first_value["2. high"];
				$timestamp=date("Y-m-d");
				
				$valuesArray= array(
					'symbol' => $SymName,	
					'close'=> $close,
					'volume' => $volume,
					'prev_close' => $prev_close,
					'change' => $change,
					'change_percent' => $change_percent,
					'timestamp' => $timestamp,
					'open' => $open
				);
				$return["tableJSON"] = $valuesArray;
				
				$url = "https://seekingalpha.com/api/sa/combined/".$SymName.".xml";
				$feed = file_get_contents($url);
				
				$items = simplexml_load_string($feed, 'SimpleXMLElement',LIBXML_NOCDATA);
				$items->registerXPathNamespace('sa', 'https://seekingalpha.com/api/1.0');
				$authors = $items->xpath("//sa:author_name");
				error_log("Hello!");
				error_log($authors);
				$items = simplexml_load_string($feed);
				$article_title=array();
				$article_link=array();
				$article_date=array();
				$article_author=array();
				$index =0;						
				$y=0;
				foreach($items->channel[0]->item as $item)
				{
					$x = $item->guid;
					if(strpos($x,'Article'))
					{
						$article_title[$index]=$item->title;
						$article_link[$index]=$item->link;
						$article_date[$index]=$item->pubDate;		
						$article_author[$index]=$authors[$y];
						$index++;
						if($index==5)
						{
							break;
						}
					}
					$y++;
				}
				
				$return["news_feed"]["article_title"]=$article_title;
				$return["news_feed"]["article_link"]=$article_link;
				$return["news_feed"]["article_date"]=$article_date;
				$return["news_feed"]["article_author"]=$article_author;
				
				/*reset($series);
				$i=0;
				while ($value = current($series)) 
				{
					$key_1= key($series);
					if($i==0)
					{
						$today=$key_1;
					}
					$value_1=Round($value["5. volume"],2);
					$value_2=Round($value["4. close"],2);
					$date_volume[$key_1]=$value_1;
					$date_price[$key_1]=$value_2;
					next($series);
					$i++;
					if($i>130)
					{
						break;
					}
				}
				$return["json_volume"]=$date_volume;
				$return["json_price"]=$date_price;
				*/
				echo json_encode($return);
		}		
		
		function indicators_function()
		{
			$SymName=$_GET["symbol"];
			$api_call="https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=".$SymName."&outputsize=full&apikey=UFOK9ERVB2YI6T65";
			$response = file_get_contents($api_call);
			$response= json_decode($response, true);
			$series=$response["Time Series (Daily)"];	
			
			
			reset($series);
			$i=0;
			while ($value = current($series)) 
			{
				$key_1= key($series);
				if($i==0)
				{
					$today=$key_1;
				}
				$value_1=Round($value["5. volume"],2);
				$value_2=Round($value["4. close"],2);
				$date_volume[$key_1]=$value_1;
				$date_price[$key_1]=$value_2;
				next($series);
				$i++;
				if($i>1000)
				{
					break;
				}
			}
			$return["symbol"]=$SymName;
			$return["today"]=$today;
			$return["json_volume"]=$date_volume;
			$return["json_price"]=$date_price;
							
			$simple_indicators = array("SMA", "EMA", "RSI", "ADX", "CCI");
			//SMA EMA RSI ADX CCI
			$SymName=$_GET["symbol"];	
			
			foreach($simple_indicators as $x )
			{
				$api_call= "https://www.alphavantage.co/query?function=".$x."&symbol=".$SymName."&interval=daily&time_period=10&series_type=close&apikey=UFOK9ERVB2YI6T65";
				
				$response = file_get_contents($api_call);
				
				$response= json_decode($response, true);
				
				$name=$response["Meta Data"]["2: Indicator"];
				
				$indicator_type= $response["Technical Analysis: ".$x];
				
				reset($indicator_type);
				//$i=0;
				while ($value = current($indicator_type)) 
				{
						$key_1=key($indicator_type);
						$value_1=(float)$indicator_type[$key_1][$x];
						$indicator_values[$key_1]=$value_1;
						next($indicator_type);
						//$i++;
				}
				
				$return[$x]["name"]=$name;
				$return[$x]["type"]=$indicator_values;
			}
			
			//error_log($return["SMA"]["type"]);
			//error_log(json_encode($return["type"]));	
			
			$api_call="https://www.alphavantage.co/query?function=BBANDS&symbol=".$SymName."&interval=daily&time_period=5&series_type=close&nbdevup=3&nbdevdn=3&apikey=UFOK9ERVB2YI6T65";
			
			$response = file_get_contents($api_call);
				
			$response= json_decode($response, true);
				
			$name=$response["Meta Data"]["2: Indicator"];
				
			$indicator_type= $response["Technical Analysis: BBANDS"];
				
			reset($indicator_type);
			
			while ($value = current($indicator_type)) 
			{
					$key_1=key($indicator_type);
					$value_1=(float)$indicator_type[$key_1]["Real Lower Band"];
					$RealLowerBand[$key_1]=$value_1;
					
					$value_2=(float)$indicator_type[$key_1]["Real Upper Band"];
					$RealUpperBand[$key_1]=$value_2;
					
					$value_3=(float)$indicator_type[$key_1]["Real Middle Band"];
					$RealMiddleBand[$key_1]=$value_3;
					
					next($indicator_type);
						
			}
				
			$return["BBANDS"]["name"]=$name;
			$return["BBANDS"]["RealUpperBand"]=$RealUpperBand;
			$return["BBANDS"]["RealLowerBand"]=$RealLowerBand;
			$return["BBANDS"]["RealMiddleBand"]=$RealMiddleBand;
			
			$api_call="https://www.alphavantage.co/query?function=MACD&symbol=".$SymName."&interval=daily&time_period=10&series_type=close&apikey=UFOK9ERVB2YI6T65";
			
			$response = file_get_contents($api_call);
				
			$response= json_decode($response, true);
				
			$name=$response["Meta Data"]["2: Indicator"];
				
			$indicator_type= $response["Technical Analysis: MACD"];
				
			reset($indicator_type);
			
			while ($value = current($indicator_type)) 
			{
					$key_1=key($indicator_type);
					$value_1=(float)$indicator_type[$key_1]["MACD_Signal"];
					$MACD_Signal[$key_1]=$value_1;
					
					$value_2=(float)$indicator_type[$key_1]["MACD"];
					$MACD[$key_1]=$value_2;
					
					$value_3=(float)$indicator_type[$key_1]["MACD_Hist"];
					$MACD_Hist[$key_1]=$value_3;
					
					next($indicator_type);			
			}				
			$return["MACD"]["name"]=$name;
			$return["MACD"]["MACD_Signal"]=$MACD_Signal;
			$return["MACD"]["MACD"]=$MACD;
			$return["MACD"]["MACD_Hist"]=$MACD_Hist;
			
			$api_call="https://www.alphavantage.co/query?function=STOCH&symbol=".$SymName."&interval=daily&time_period=5&series_type=close&slowkmatype=1&slowdmatype=1&apikey=UFOK9ERVB2YI6T65";
			
			$response = file_get_contents($api_call);
				
			$response= json_decode($response, true);
				 
			$name=$response["Meta Data"]["2: Indicator"];
				
			$indicator_type= $response["Technical Analysis: STOCH"];
				
			reset($indicator_type);
			
			while ($value = current($indicator_type)) 
			{
					$key_1=key($indicator_type);
					$value_1=(float)$indicator_type[$key_1]["SlowK"];
					$SlowK[$key_1]=$value_1;
					
					$value_2=(float)$indicator_type[$key_1]["SlowD"];
					$SlowD[$key_1]=$value_2;		
					next($indicator_type);			
			}				
			$return["STOCH"]["name"]=$name;
			$return["STOCH"]["SlowD"]=$SlowD;
			$return["STOCH"]["SlowK"]=$SlowK;
			
			echo json_encode($return);
		}
		
?>