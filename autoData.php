<?php
				header('content-type: application/json; charset=utf-8');
				header("access-control-allow-origin: *");
				if(isset($_GET["symbol"]))
				{
				$SymName=$_GET["symbol"];
			
				$api_call="http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=".$SymName;
				$response = file_get_contents($api_call);
				$response= json_decode($response, true);
								
				echo isset($_GET['callback'])
				? "{$_GET['callback']}($response)"
				: $response;
				}
				else
					echo "";
?>