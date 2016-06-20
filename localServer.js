//http://www.cpcb.nic.in/FINAL-REPORT_AQI_.pdf


var bodyParser = require('body-parser');	
var express = require('express');
var mysql = require('mysql');

var app = express()	
app.use(bodyParser.json())

//app.use(bodyParser())

app.use(express.static('Airzen'));

//app.use(express.static('files'));

/*app.get('/',function(req, res){
	res.json({
		hello:'noHello'	
	});
})*/

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'airzen1234',
  database : 'AirPure'
});



var updateWeekTable = function(deviceId)
{
		
	deviceId = 'A123';
	var nitrogenDioxide;
	var pm25;
	var pm10;
	var carbonMonoxide;
	var ozone;
	var temperature;
	var humidity;
	var aqi;

	connection.query('SELECT timeStmp from pastWeek WHERE deviceId="'+deviceId + '" ORDER BY timeStmp LIMIT 1', function(err, rows, fields) {
	  	if (!err)
		{
	  		if(rows.length!=0){
	  			if((new Date() - Date.parse(rows[0].timeStmp)) > 1000*60*60*24*7){
	  				connection.query('Delete from pastWeek WHERE deviceId="'+deviceId+'"', function(err2, rows2, fields2) {
	  				  	if (!err2)
	  				  		console.log("Rows deleted from pastWeek");
	  				  	else
	  				    	console.log('Error while performing Query - Delete from pastWeek, in func updateWeekTable',err2);
	  				});
	  			}
	  		}
	  	}
	  	else
	    	console.log('Error while performing Query-SELECT timeStmp from pastWeek, in updateWeekTable.',err);

	    connection.query('SELECT * from past24Hour', function(err3, rows3, fields3) 
		{
	      	if (!err3){
	      		nitrogenDioxide=Math.ceil(getAvg(rows3,"nitrogenDioxide"));
	      		pm25=Math.ceil(getAvg(rows3,"pm25"));
	      		pm10=Math.ceil(getAvg(rows3,"pm10"));
	      		carbonMonoxide=Math.ceil(getAvg(rows3,"carbonMonoxide"));
	      		ozone=Math.ceil(getAvg(rows3,"ozone"));
	      		temperature=getAvg(rows3,"temperature");
	      		humidity=getAvg(rows3,"humidity");
	      		aqi=getAvg(rows3,"aqi");

	        	connection.query('INSERT INTO pastWeek VALUES("'+deviceId+'",now(),'+nitrogenDioxide+','+carbonMonoxide+','+pm25+','+pm10+','+ozone+','+temperature+','+humidity+','+aqi+')', function(err4, rows4, fields4) {
	        	  	if (err4)
	        	  		console.log('Error while performing Query - INSERT INTO pastWeek VALUES, in func updateWeekTable',err4);
	        	  	else{
	        	  		console.log('Row inserted in pastWeek from func updateWeekTable.');
	        	  	}

	        	});
	      	}
	      	else
	        	console.log('Error while performing Query - SELECT * from past24Hour, in func updateWeekTable.',err3);
	    });
	});
}

var updateYearTable = function(deviceId){
		
	deviceId = 'A123';
	var nitrogenDioxide;
	var pm25;
	var pm10;
	var carbonMonoxide;
	var ozone;
	var temperature;
	var humidity;
	var aqi;

	connection.query('SELECT * from pastMonth', function(err, rows, fields) {
	  	if (!err){
	  		nitrogenDioxide=Math.ceil(getAvg(rows,"nitrogenDioxide"));
	  		pm25=Math.ceil(getAvg(rows,"pm25"));
	  		pm10=Math.ceil(getAvg(rows,"pm10"));
	  		carbonMonoxide=Math.ceil(getAvg(rows,"carbonMonoxide"));
	  		ozone=Math.ceil(getAvg(rows,"ozone"));
	  		temperature=getAvg(rows,"temperature");
	  		humidity=getAvg(rows,"humidity");
	  		aqi = getAvg(rows,"aqi");

	  		connection.query('Delete from pastMonth WHERE deviceId="'+deviceId+'"', function(err2, rows2, fields2) {
	  		  	if (!err)
	  		  		console.log("Rows deleted from pastMonth");
	  		  	else
	  		    	console.log('Error while performing Query - Delete from pastMonth, in func updateMonthTable',err2);
	  		});

	    	connection.query('INSERT INTO pastYear VALUES("'+deviceId+'",now(),'+nitrogenDioxide+','+carbonMonoxide+','+pm25+','+pm10+','+ozone+','+temperature+','+humidity+','+aqi+')', function(err3, rows3, fields3) {
	    	  	if (err)
	    	  		console.log('Error while performing Query on pastYear in func updateYearTable.',err3);
	    	  	else{
	    	  		console.log('Row inserted in pastYear in updateYearTable.');
	    	  	}

	    	});
	  	}
	  	else
	    	console.log('Error while performing Query - SELECT * from pastMonth, in func updateYearTable',err);
	});
}

var updateMonthTable = function(deviceId){
		
	//deviceId = 'A123';
	var nitrogenDioxide;
	var pm25;
	var pm10;
	var carbonMonoxide;
	var ozone;
	var temperature;
	var humidity;
	var aqi;

	connection.query('SELECT * from past24Hour where deviceId = "'+deviceId+'"', function(err, rows, fields) {
	  	if (!err){
	  		nitrogenDioxide=Math.ceil(getAvg(rows,"nitrogenDioxide"));
	  		pm25=Math.ceil(getAvg(rows,"pm25"));
	  		pm10=Math.ceil(getAvg(rows,"pm10"));
	  		carbonMonoxide=Math.ceil(getAvg(rows,"carbonMonoxide"));
	  		ozone=Math.ceil(getAvg(rows,"ozone"));
	  		temperature=getAvg(rows,"temperature");
	  		humidity=getAvg(rows,"humidity");
	  		aqi=getAvg(rows,"aqi");

	  		connection.query('Delete from past24Hour WHERE deviceId="'+deviceId+'"', function(err2, rows2, fields2) {
	  		  	if (!err2)
	  		  		console.log("Rows deleted from past24Hour");
	  		  	else
	  		    	console.log('Error while performing Query - Delete from past24Hour, in func updateMonthTable',err2);
	  		});

	    	connection.query('INSERT INTO pastMonth VALUES("'+deviceId+'",now(),'+nitrogenDioxide+','+carbonMonoxide+','+pm25+','+pm10+','+ozone+','+temperature+','+humidity+','+aqi+')', function(err3, rows3, fields3) {
	    	  	if (err)
	    	  		console.log('Error while performing Query on PastMonth in func updateMonthTable.',err3);
	    	  	else{
	    	  		console.log('Row inserted in pastMonth from updateMonthTable.');

	    	  	}
	    	});
	  	}
	  	else
	    	console.log('Error while performing Query on past24Hour in func updateMonthTable. ',err);
	});

	connection.query('SELECT timeStmp from pastMonth WHERE deviceId="'+deviceId + '" ORDER BY timeStmp LIMIT 1', function(err4, rows4, fields4) {
	  	if (!err4){
	  		if(rows4.length!=0){
	  			if((new Date() - Date.parse(rows4[0].timeStmp)) > 1000*60*60*24*30){
	  				updateYearTable(deviceId);
	  			}
	  		}
	  				
	  		//console.log('The solution is: ', rows[0].timeStmp);
	  	}
	  	else
	    	console.log('Error while performing Query on pastMonth in updateMonthTable.',err4);
	});
}

var update24HourTable = function(deviceId){
		
	//deviceId = 'A123';
	var nitrogenDioxide;
	var pm25;
	var pm10;
	var carbonMonoxide;
	var ozone;
	var temperature;
	var humidity;
	var aqi;

	connection.query('SELECT * from pastHour where deviceId="'+deviceId+'"', function(err, rows, fields) {
	  	if (!err){
	  		nitrogenDioxide=Math.ceil(getAvg(rows,"nitrogenDioxide"));
	  		pm25=Math.ceil(getAvg(rows,"pm25"));
	  		pm10=Math.ceil(getAvg(rows,"pm10"));
	  		carbonMonoxide=Math.ceil(getAvg(rows,"carbonMonoxide"));
	  		ozone=Math.ceil(getAvg(rows,"ozone"));
	  		temperature=getAvg(rows,"temperature");
	  		humidity=getAvg(rows,"humidity");
	  		aqi = getAvg(rows,"aqi");

	  		connection.query('Delete from pastHour WHERE deviceId="'+deviceId+'" AND (now() - timeStmp)>7', function(err2,rows2, fields2) {
	  		  	if (!err2)	
	  		  		console.log("Rows deleted from pastHour");
	  		  	else
	  		    	console.log('Error while performing Query - Delete from pastHour, in func updatePast24Hour',err2);
	  		});

	    	connection.query('INSERT INTO past24Hour VALUES("'+deviceId+'",now(),'+nitrogenDioxide+','+carbonMonoxide+','+pm25+','+pm10+','+ozone+','+temperature+','+humidity+','+aqi+')', function(err3, rows3, fields3) {
	    	  	if (err3)
	    	  		console.log('Error while performing Query in function updatePast24Hour in query "insert into past24hour".',err3);
	    	  	else{
	    	  		console.log('Row inserted in past24Hour.');
	    	  		connection.query('SELECT timeStmp from past24Hour WHERE deviceId="'+deviceId + '" ORDER BY timeStmp LIMIT 1', function(err4, rows4, fields4) {
	    	  		  	if (!err4){
	    	  		  		if(rows4.length!=0){
	    	  		  			if((new Date() - Date.parse(rows4[0].timeStmp)) > 1000*60*60*24){
	    	  		  				updateWeekTable(deviceId);
	    	  		  				updateMonthTable(deviceId);
	    	  		  			}
	    	  		  		}
	    	  		  	}
	    	  		  	else
	    	  		    	console.log('Error while performing Query in function updatePast24Hour in query "SELECT timeStmp from past24Hour".',err4);
	    	  		});	
	    	  	}

	    	});
			
	  	}
	  	else
	    	console.log('Error while performing Query in function updatePast24Hour in query "SELECT * from pastHour".',err);
	});
}


//connection.end();

app.post('/AirPure/current', function (req, res) {
	//console.log(req.apikey);
	var reqData = new Array();
	var maxAqi = new Array();
	/*reqData["deviceId"] = req.body.deviceId;
	reqData["nitrogenDioxide"] = req.body.nitrogenDioxide;
	reqData["ozone"] = req.body.ozone;
	reqData["pm10"] = req.body.pm10;
	reqData["pm25"] = req.body.pm25;
	reqData["carbonMonoxide"] = req.body.carbonMonoxide;
	reqData["humidity"]=req.body.humidity;
	reqData["temperature"]=req.body.temperature;
	dbInsertLatest(reqData);*/
	reqData["deviceId"] = "A123";
	reqData["nitrogenDioxide"] = maxAqi[0] = Math.random()*500+1;
	reqData["ozone"] = maxAqi[1] = Math.random()*500+1;
	reqData["pm10"] = maxAqi[2] = Math.random()*500+1;
	reqData["pm25"] = maxAqi[3] = Math.random()*500+1;
	reqData["carbonMonoxide"] = maxAqi[4] = Math.random()*500+1;
	reqData["humidity"] = Math.random()*100;
	reqData["temperature"] = Math.random()*75-20;
	reqData["aqi"] = Math.max.apply(Math,maxAqi);
	dbInsertLatest(reqData);
	console.log(reqData);
  res.json([
    {
      username: 'AirPure',
      body: 'node rocks!'
    }
  ])
})

/*
var aqi ={
    "ozone": [0.059, 0.075, 0.096, 0.116, 0.374, 0.504, 0.604],  //ppm
    "pm10":[54, 154, 254, 354, 424, 504, 604],      //microgram/metercube
    "pm25":[15.4, 40.4, 65.4, 150.4, 250.4, 350.4, 500.4],      //microgram/metercube
    "carbonMonoxide":[4.4, 9.4, 12.4, 15.4, 30.4, 40.4, 50.4],      //ppm
    "nitrogenDioxide":[0.0324, 0.0649, 0.146, 0.227, 0.324, 1.64, 2.04],        //ppm
    "aqi":[50, 100, 150, 200, 300, 400, 500]
}*/



var getIndex = function(str, val)
{
    var high, I_high,low,I_low;
    for(var i =0; i < 5; i++){
        if(aqi[str][i] >= val){
            high = aqi[str][i];
            I_high = aqi["aqi"][i];
            //echo high." ".I_high."<br>";
            if(i != 0){
                low = aqi[str][i-1];
                I_low = aqi["aqi"][i-1];
            }else{
                low = 0;
                I_low = 0;
            }
            break;
        }
        else if(val>aqi[str][4]){
        	high = val;
            I_high = 500;
            low = aqi[str][4];
            I_low = 400;
            break;
        }
    }
    /*if(str=="nitrogenDioxide"){
    	console.log("--------"+I_low+","+I_high+","+low+","+high+","+val);
    }*/
    return getAQI(I_low, I_high, low, high, val);
}



/*app.post("/api/app", function(req, res){
	var reqData = new Array();
	reqData["deviceId"] = req.body.deviceId;
	reqData["age"] = req.body.age;
	reqData["defectPreferences"] = req.body.defectPreferences;

	var resData = new Array();
	console.log(req.body);

	res.json([
    {
      username: 'AirPure',
      body: 'node rocks!'
    }
  ])
})*/




//throatcancer,bronchitis,eyeinfections,emphysema,tissueinflammation,nervoussystemdisorders,chronicheartdisease,headache,nausea,irregularheartbeat


var initGasInfo = function(gasSequence,gasInfoObjSequence){
	var gasInfo = new Array();
	for (var i = 0; i < gasSequence.length; i++) {
		gasInfo[i]={};
		for (var j = 0; j < gasInfoObjSequence.length; j++) {  
			gasInfo[i][gasInfoObjSequence[j]] = new Array();
		};
		gasInfo[i]["gasType"] = gasSequence[i];
	};
	return gasInfo;
}



function getSQL(deviceId,healthCond,age,callback) {
    //var query = 'SELECT * FROM test';
    var gasSequence = ["aqi","nitrogenDioxide","ozone","pm25","pm10","carbonMonoxide","temperature","humidity"];
    var gasInfoObjSequence = ["gasType","aqi","pastDay","pastWeek","pastMonth","pastYear","healthRisks","suggestions"];
    var aqiValues = {"aqi":0,"nitrogenDioxide":0,"ozone":0,"pm25":0,"pm10":0,"carbonMonoxide":0};
    var suggestions;
    connection.query('SELECT * from pastHour WHERE deviceId="'+ deviceId+'" ORDER BY timeStmp DESC LIMIT 1', function(err, rows, fields){
    	var json = '';
		var gasInfo = initGasInfo(gasSequence,gasInfoObjSequence);
		if(err){
			for (var i = 0; i < gasInfo.length; i++) {
				gasInfo[i]["aqi"] = 0;
			};
		}
		else{
			for (var i = 0; i < gasInfo.length; i++) {
				gasInfo[i]["aqi"] = rows[0][gasInfo[i]["gasType"]];
				aqiValues[gasInfo[i]["gasType"]] = rows[0][gasInfo[i]["gasType"]]; //storing all aqi values in an object 'aqiValues'
			};	
			suggestions = getSuggestions(healthCond,age,gasSequence,aqiValues);	
			for (var i = 0; i < gasInfo.length; i++) {
				gasInfo[i]["healthRisks"] = suggestions[gasInfo[i]["gasType"]]["healthRisks"];
				gasInfo[i]["suggestions"] = suggestions[gasInfo[i]["gasType"]]["suggestions"];
			};
		}

		connection.query('SELECT * from past24Hour WHERE deviceId="'+ deviceId+'"', function(err2, rows2, fields2){
			if(err2){
				for (var i = 0; i < gasInfo.length; i++) {
					gasInfo[i]["pastDay"] = [];
				}
			}
			else{
				for (var i = 0; i < gasInfo.length; i++) {
					var pastDayData = new Array();
					for (var j = 0; j < rows2.length; j++) {
						pastDayData[j] = rows2[j][gasInfo[i]["gasType"]];
					};
					gasInfo[i]["pastDay"] = pastDayData;		
				}
			}
			connection.query('SELECT * from pastWeek WHERE deviceId="'+ deviceId+'"', function(err3, rows3, fields3){
				if(err3){
					for (var i = 0; i < gasInfo.length; i++) {
						gasInfo[i]["pastWeek"] = [];
					}
				}
				else{
					for (var i = 0; i < gasInfo.length; i++) {
						var data = new Array();
						for (var j = 0; j < rows3.length; j++) {
							data[j] = rows3[j][gasInfo[i]["gasType"]];
						};
						gasInfo[i]["pastWeek"] = data;		
					}
				}

				connection.query('SELECT * from pastMonth WHERE deviceId="'+ deviceId+'"', function(err4, rows4, fields4){
					if(err4){
						for (var i = 0; i < gasInfo.length; i++) {
							gasInfo[i]["pastMonth"] = [];
						}
					}
					else{
						for (var i = 0; i < gasInfo.length; i++) {
							var data = new Array();
							for (var j = 0; j < rows4.length; j++) {
								data[j] = rows4[j][gasInfo[i]["gasType"]];
							};
							gasInfo[i]["pastMonth"] = data;		
						}
					}

					connection.query('SELECT * from pastYear WHERE deviceId="'+ deviceId+'"', function(err5, rows5, fields5){
						if(err5){
							for (var i = 0; i < gasInfo.length; i++) {
								gasInfo[i]["pastYear"] = [];
							}
						}
						else{
							for (var i = 0; i < gasInfo.length; i++) {
								var data = new Array();
								for (var j = 0; j < rows5.length; j++) {
									data[j] = rows5[j][gasInfo[i]["gasType"]];
								};
								gasInfo[i]["pastYear"] = data;		
							}
						}
						json = JSON.stringify({"inferences":getInferences(deviceId),"gasSpecific":gasInfo});
						console.log('JSON-result:', json);
						callback(null, json);	
					});
				});
			});
		});
    });
};






var http = require('http'),
    fs = require('fs');

app.get("/", function(req, res){
	fs.readFile('Airzen/index.html', function (err, html) {
	    if (err) {
	        throw err; 
	    }       
	    
	    res.writeHeader(200, {"Content-Type": "text/html"});  
	    res.write(html);  
	    res.end();
	});	//console.log(resJson);
	//console.log(req.body);
})

app.listen(8081, function () {
  console.log('Server listening on',8081)
})	
