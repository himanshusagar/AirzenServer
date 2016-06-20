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


var getSuggExercise = function(aqiValues,suggestions)
{
	if(aqiValues["ozone"]>100 && aqiValues["ozone"]<=300){
		suggestions["aqi"]["suggestions"].push("Reduce strenous activity and avoid activites like running and jogging.");
		suggestions["ozone"]["suggestions"].push("Reduce strenous activity and avoid activites like running and jogging.");
	}

	else if(aqiValues["ozone"]>300){
		suggestions["aqi"]["suggestions"].push("Avoid exercise at all costs.Keep the body in an easy state.High chances of ozone dissolving in ELF. Can also affect immune cells and neural receptors.");
		suggestions["ozone"]["suggestions"].push("Avoid exercise at all costs.Keep the body in an easy state.High chances of ozone dissolving in ELF. Can also affect immune cells and neural receptors.");
	}
	
	if(aqiValues["carbonMonoxide"]>100 && aqiValues["carbonMonoxide"]<=300){
		suggestions["aqi"]["suggestions"].push("Heavy exercise would cause high intake of CO, which will reduce oxygen in the blood. Fainting is common. Leave the strenous activity.")
		suggestions["carbonMonoxide"]["suggestions"].push("Heavy exercise would cause high intake of CO, which will reduce oxygen in the blood. Fainting is common. Leave the strenous activity.")
	}

	else if(aqiValues["carbonMonoxide"]>300){
		suggestions["aqi"]["suggestions"].push("Stop right now! You may faint soon due to high intake of CO. Control your breathing and call for help immediately. Open the windows or evacuate the place.");
		suggestions["carbonMonoxide"]["suggestions"].push("Stop right now! You may faint soon due to high intake of CO. Control your breathing and call for help immediately. Open the windows or evacuate the place.");
	}
	return suggestions;
}

var getSuggDustAllergy = function(aqiValues,suggestions){
	if(aqiValues["pm25"]>100 && aqiValues["pm25"]<=300){
		suggestions["aqi"]["suggestions"].push("High concentration of particulate matter can cause allergic reactions in the nasal passage.Use a mask or some filter appropriately.");
		suggestions["pm25"]["suggestions"].push("High concentration of particulate matter can cause allergic reactions in the nasal passage.Use a mask or some filter appropriately.");		
	}
	else if(aqiValues["pm25"]>300){
		suggestions["aqi"]["suggestions"].push("Avoid this area completely.Will trigger serious allergic effects. Nasal inflammations are very likely with breathing problems.");
		suggestions["pm25"]["suggestions"].push("Avoid this area completely.Will trigger serious allergic effects. Nasal inflammations are very likely with breathing problems.");
	} 
	else if(aqiValues["pm10"]>100 && aqiValues["pm10"]<=300){	//Suggestions are same currently, that is why "else if" used
		suggestions["aqi"]["suggestions"].push("High concentration of particulate matter can cause allergic reactions in the nasal passage.Use a mask or some filter appropriately.");
		suggestions["pm10"]["suggestions"].push("High concentration of particulate matter can cause allergic reactions in the nasal passage.Use a mask or some filter appropriately.");		
	}
	else if(aqiValues["pm10"]>300){
		suggestions["aqi"]["suggestions"].push("Avoid this area completely.Will trigger serious allergic effects. Nasal inflammations are very likely with breathing problems.");
		suggestions["pm10"]["suggestions"].push("Avoid this area completely.Will trigger serious allergic effects. Nasal inflammations are very likely with breathing problems.");
	}
	return suggestions;
}	

var getSuggAsthma = function(aqiValues,suggestions){
	if(aqiValues["ozone"]>100 && aqiValues["ozone"]<=300){
		//suggestions["aqi"]["suggestions"].push("Avoid the area.");
		suggestions["aqi"]["healthRisks"].push("It can trigger throat and lung problems!");
		suggestions["ozone"]["healthRisks"].push("It can trigger throat and lung problems!");
		//suggestions["ozone"]["suggestions"].push("Avoid the area.");
	}

	else if(aqiValues["ozone"]>300){
		//suggestions["aqi"]["suggestions"].push("Avoid this area!");
		suggestions["aqi"]["healthRisks"].push("Severe coughing and wheezing can be triggered. Airway inflammation is possible.High vulnerability to lung aveolis.");
		suggestions["ozone"]["healthRisks"].push("Severe coughing and wheezing can be triggered. Airway inflammation is possible.High vulnerability to lung aveolis.");
		//suggestions["ozone"]["suggestions"].push("Avoid this area!");
	}

	if(aqiValues["pm25"]>300){
		suggestions["aqi"]["healthRisks"].push("High levels of particulate matter. Asthmatic patients can have serious triggers.");
		suggestions["aqi"]["suggestions"].push("Keep inhaler in handy.");
		suggestions["pm25"]["healthRisks"].push("High levels of particulate matter. Asthmatic patients can have serious triggers.");
		suggestions["pm25"]["suggestions"].push("Keep inhaler in handy.");
	}
	return suggestions;
}

var getSuggHeadache = function(aqiValues,suggestions){
	if(aqiValues["ozone"]>300){
		//suggestions["aqi"]["suggestions"].push("Avoid this area!");
		suggestions["aqi"]["healthRisks"].push("Due to high concentration of ozone headache might increase and there are chances of fainting");
		suggestions["ozone"]["healthRisks"].push("Due to high concentration of ozone headache might increase and there are chances of fainting");
		//suggestions["ozone"]["suggestions"].push("Avoid this area!");
	}

	if(aqiValues["carbonMonoxide"]>100 && aqiValues["carbonMonoxide"]<=300){
		suggestions["aqi"]["suggestions"].push("Prolonged headache maybe beacuse of excess of carbon monoxide. Vacate the place for safety.");
		suggestions["aqi"]["healthRisks"].push("Chances of carbon monoxide poisoning.");
		suggestions["carbonMonoxide"]["healthRisks"].push("Chances of carbon monoxide poisoning.");
		suggestions["carbonMonoxide"]["suggestions"].push("Prolonged headache maybe beacuse of excess of carbon monoxide. Vacate the place for safety.");
	}

	else if(aqiValues["carbonMonoxide"]>300){
		suggestions["aqi"]["suggestions"].push("Take someone's help to find a safe open place.");
		suggestions["aqi"]["healthRisks"].push("Very high chances of CO poisoning and the headache maybe a symptom of it.");
		suggestions["carbonMonoxide"]["healthRisks"].push("Very high chances of CO poisoning and the headache maybe a symptom of it.");
		suggestions["carbonMonoxide"]["suggestions"].push("Take someone's help to find a safe open place.");
	}
	return suggestions;
}

var getSuggAge = function(aqiValues,suggestions,age){
	if(aqiValues["carbonMonoxide"]>100 && aqiValues["carbonMonoxide"]<=300){
		if(age<15){
			suggestions["aqi"]["suggestions"].push("Contact your parents if any complications occur and vacate the place if possible.");
			suggestions["aqi"]["healthRisks"].push("Carbon monoxide dissolves at a higher rate in the blood in younger kids.");
			suggestions["carbonMonoxide"]["healthRisks"].push("Carbon monoxide dissolves at a higher rate in the blood in younger kids.");
			suggestions["carbonMonoxide"]["suggestions"].push("Contact your parents if any complications occur and vacate the place if possible.");	
		}
		
	}

	else if(aqiValues["carbonMonoxide"]>300){
		if(age<15){
			suggestions["aqi"]["suggestions"].push("Open all the gates if it is a closed space. Make emergency call to the parents.");
			suggestions["aqi"]["healthRisks"].push("Carbon monoxide dissolves at a higher rate in the blood in younger kids.");
			suggestions["carbonMonoxide"]["healthRisks"].push("Very high chances of CO poisoning and the headache maybe a symptom of it.");
			suggestions["carbonMonoxide"]["suggestions"].push("Open all the gates if it is a closed space. Make emergency call to the parents.");	
		}	
	}

	if(aqiValues["ozone"]>100 && aqiValues["ozone"]<=300){
		if(age<15){
			suggestions["aqi"]["suggestions"].push("Active children of your age should reduce external activities to a bare minimal.");
			//suggestions["aqi"]["healthRisks"].push("Chances of carbon monoxide poisoning.");
			//suggestions["ozone"]["healthRisks"].push("Chances of carbon monoxide poisoning.");
			suggestions["ozone"]["suggestions"].push("Active children of your age should reduce external activities to a bare minimal.");	
		}
	}

	else if(aqiValues["ozone"]>300){
		if(age<15){
			suggestions["aqi"]["suggestions"].push("Active children of your age should reduce external activities to a bare minimal.");
			suggestions["aqi"]["healthRisks"].push("Higher ozone concentrations can cause throat problems, chest pain.Chances of increased solubility in epithelial lining fluid.");
			suggestions["ozone"]["healthRisks"].push("Higher ozone concentrations can cause throat problems, chest pain.Chances of increased solubility in epithelial lining fluid.");
			suggestions["ozone"]["suggestions"].push("Active children of your age should reduce external activities to a bare minimal.");	
		}
	}

	if(aqiValues["pm25"]>100 && aqiValues["pm25"]<=300){
		if(age<60){
			suggestions["aqi"]["suggestions"].push("Active children of your age should reduce external activities to a bare minimal.");
			//suggestions["aqi"]["healthRisks"].push("Chances of carbon monoxide poisoning.");
			//suggestions["ozone"]["healthRisks"].push("Chances of carbon monoxide poisoning.");
			suggestions["ozone"]["suggestions"].push("Active children of your age should reduce external activities to a bare minimal.");	
		}
	}
		
	else if(aqiValues["pm25"]>300){
		if(age<15){
			suggestions["aqi"]["suggestions"].push("Older people should not visit this place.");
			suggestions["aqi"]["healthRisks"].push("Chances of coughing and wheezing are prominent.");
			suggestions["pm25"]["suggestions"].push("Older people should not visit this place.");
			suggestions["pm25"]["healthRisks"].push("Chances of coughing and wheezing are prominent.");
		}
		else if(age>60){
			suggestions["aqi"]["suggestions"].push("Take suitable help if necessary to cover the face and nose.");
			suggestions["aqi"]["healthRisks"].push("Excess coughing and fainting can be caused.");
			suggestions["pm25"]["suggestions"].push("Take suitable help if necessary to cover the face and nose.");
			suggestions["pm25"]["healthRisks"].push("Excess coughing and fainting can be caused.");
		}
	}

	if(aqiValues["pm10"]>300){
		if(age<15){
			suggestions["aqi"]["suggestions"].push("Clean your throat and nose immediately and cover the faces.");
			suggestions["aqi"]["healthRisks"].push("Bigger particles wil stick in the throat.");
			suggestions["pm10"]["suggestions"].push("Clean your throat and nose immediately and cover the faces.");
			suggestions["pm10"]["healthRisks"].push("Bigger particles wil stick in the throat.");
		}
		else if(age>60){
			suggestions["aqi"]["suggestions"].push("Cover with masks and drink proper water. Take assistance to leave the space, or cover yourself.");
			suggestions["aqi"]["healthRisks"].push("Older people may have their throats jammed with bigger particles.");
			suggestions["pm10"]["suggestions"].push("Cover with masks and drink proper water. Take assistance to leave the space, or cover yourself.");
			suggestions["pm10"]["healthRisks"].push("Older people may have their throats jammed with bigger particles.");
		}
	}
	return suggestions;
}

var getSuggHeartDisease = function(aqiValues,suggestions){
	if(aqiValues["carbonMonoxide"]>100 && aqiValues["carbonMonoxide"]<=300){
		//suggestions["aqi"]["suggestions"].push("Vacate the place for safety.");
		suggestions["aqi"]["healthRisks"].push("Carbon monoxide dissolves in the blood to form carboxyhaemoglobin. This reduces oxygen level and can cause heart fails.");
		suggestions["carbonMonoxide"]["healthRisks"].push("Carbon monoxide dissolves in the blood to form carboxyhaemoglobin. This reduces oxygen level and can cause heart fails.");
		//suggestions["carbonMonoxide"]["suggestions"].push("Prolonged headache maybe beacuse of excess of carbon monoxide. Vacate the place for safety.");
	}

	else if(aqiValues["carbonMonoxide"]>300){
		suggestions["aqi"]["suggestions"].push("Carbon monoxide dissolves in the blood to form carboxyhaemoglobin. Heart patients should take in external assistance necessarily.");
		suggestions["aqi"]["healthRisks"].push("Very high concentration of carbon monoxide, might cause heart fail");
		suggestions["carbonMonoxide"]["healthRisks"].push("Carbon monoxide dissolves in the blood to form carboxyhaemoglobin. Heart patients should take in external assistance necessarily.");
		suggestions["carbonMonoxide"]["suggestions"].push("Very high concentration of carbon monoxide, might cause heart fail");
	}

	if(aqiValues["nitrogenDioxide"]>100 && aqiValues["nitrogenDioxide"]<=300){
		suggestions["aqi"]["suggestions"].push("Nitrogen dioxide can cause pulmovascular diseases and heart patients should avoid such places.");
		suggestions["aqi"]["healthRisks"].push("Heart chokes and inflammations possible.");
		suggestions["nitrogenDioxide"]["suggestions"].push("Nitrogen dioxide can cause pulmovascular diseases and heart patients should avoid such places.");
		suggestions["nitrogenDioxide"]["healthRisks"].push("Heart chokes and inflammations possible.");
	}

	
	else if(aqiValues["nitrogenDioxide"]>300){
		//suggestions["aqi"]["suggestions"].push("Nitrogen dioxide can cause pulmovascular diseases and heart patients should avoid such places.");
		suggestions["aqi"]["healthRisks"].push("Heart blocks and minor heart attacks are possible.Nitric acid formation might dissolve sensitive tissues causing severe burns.");
		//suggestions["nitrogenDioxide"]["suggestions"].push("Nitrogen dioxide can cause pulmovascular diseases and heart patients should avoid such places.");
		suggestions["nitrogenDioxide"]["healthRisks"].push("Heart blocks and minor heart attacks are possible.Nitric acid formation might dissolve sensitive tissues causing severe burns.");
	}
	return suggestions;
}

var getSuggHeartDisease = function(aqiValues,suggestions){
	if(aqiValues["ozone"]>100 && aqiValues["ozone"]<=300){
		suggestions["aqi"]["suggestions"].push("Use masks if possible.");
		suggestions["aqi"]["healthRisks"].push("High chances of increased coughing. Can cause minor injuries in airway.");
		suggestions["ozone"]["suggestions"].push("Use masks if possible.");
		suggestions["ozone"]["healthRisks"].push("High chances of increased coughing. Can cause minor injuries in airway.");
	}

	else if(aqiValues["ozone"]>300){
		suggestions["aqi"]["suggestions"].push("Maintain a continuous breathing cycle.");
		suggestions["aqi"]["healthRisks"].push("High levels of coughing and wheezing are very likely.");
		suggestions["ozone"]["suggestions"].push("Maintain a continuous breathing cycle.");
		suggestions["ozone"]["healthRisks"].push("High levels of coughing and wheezing are very likely.");
	}

	if(aqiValues["pm25"]>100 && aqiValues["nitrogenDioxide"]<=300){
		//suggestions["aqi"]["suggestions"].push("Nitrogen dioxide can cause pulmovascular diseases and heart patients should avoid such places.");
		suggestions["aqi"]["healthRisks"].push("Particulate matter of smaller size goes to the alveoli level and coughing and wheezing will be triggered.");
		//suggestions["pm25"]["suggestions"].push("Nitrogen dioxide can cause pulmovascular diseases and heart patients should avoid such places.");
		suggestions["pm25"]["healthRisks"].push("Particulate matter of smaller size goes to the alveoli level and coughing and wheezing will be triggered.");
	}

	
	else if(aqiValues["pm25"]>300){
		suggestions["aqi"]["suggestions"].push(" Clean the nose and throat and leave the place. Take inhalers and masks always.");
		suggestions["aqi"]["healthRisks"].push("Particulate matter might stick in the windpipe and cause irritation and coughing.");
		suggestions["pm25"]["suggestions"].push(" Clean the nose and throat and leave the place. Take inhalers and masks always.");
		suggestions["pm25"]["healthRisks"].push("Particulate matter might stick in the windpipe and cause irritation and coughing.");
	}

	else if(aqiValues["pm25"]>100 && aqiValues["nitrogenDioxide"]<=300){
		//suggestions["aqi"]["suggestions"].push("Nitrogen dioxide can cause pulmovascular diseases and heart patients should avoid such places.");
		suggestions["aqi"]["healthRisks"].push("Particulate matter of smaller size goes to the alveoli level and coughing and wheezing will be triggered.");
		//suggestions["pm10"]["suggestions"].push("Nitrogen dioxide can cause pulmovascular diseases and heart patients should avoid such places.");
		suggestions["pm10"]["healthRisks"].push("Particulate matter of smaller size goes to the alveoli level and coughing and wheezing will be triggered.");
	}

	
	else if(aqiValues["pm25"]>300){
		suggestions["aqi"]["suggestions"].push(" Clean the nose and throat and leave the place. Take inhalers and masks always.");
		suggestions["aqi"]["healthRisks"].push("Particulate matter might stick in the windpipe and cause irritation and coughing.");
		suggestions["pm10"]["suggestions"].push(" Clean the nose and throat and leave the place. Take inhalers and masks always.");
		suggestions["pm10"]["healthRisks"].push("Particulate matter might stick in the windpipe and cause irritation and coughing.");
	}

	return suggestions;
}

var getSuggGeneral = function(aqiValues,suggestions){
	var ozone = aqiValues["ozone"];
	var ozone = aqiValues["ozone"];
	var no2 = aqiValues["nitrogenDioxide"];
	var pm25 = aqiValues["pm25"];
	var pm10 = aqiValues["pm10"];
	var co = aqiValues["carbonMonoxide"];
	
	if(ozone>50 && ozone<=100){
		suggestions["aqi"]["healthRisks"].push("Unusually sensitive individuals may experience respiratory symptoms.");
		suggestions["aqi"]["suggestions"].push("Conserve electricity and set air conditioners no lower than 78 degrees.");
		suggestions["ozone"]["healthRisks"].push("Unusually sensitive individuals may experience respiratory symptoms.");
		suggestions["ozone"]["suggestions"].push("Conserve electricity and set air conditioners no lower than 78 degrees.");
		suggestions["ozone"]["suggestions"].push("Refuel your car in the evening when its cooler.");
	}

	else if(ozone>100 && ozone<=200){
		suggestions["aqi"]["healthRisks"].push("Increasing likelihood of respiratory symptoms and breathing discomfort in active children and adults and people with lung disease, such as asthma");
		suggestions["aqi"]["suggestions"].push("Choose a cleaner commute - share a ride to work or use public transportation.");
		suggestions["ozone"]["healthRisks"].push("Increasing likelihood of respiratory symptoms and breathing discomfort in active children and adults and people with lung disease, such as asthma");
		suggestions["ozone"]["suggestions"].push("Conserve electricity and set air conditioners no lower than 78 degrees.");
		suggestions["ozone"]["suggestions"].push("Choose a cleaner commute - share a ride to work or use public transportation.");	
	}

	else if(ozone>200){
		suggestions["aqi"]["healthRisks"].push("Increasingly severe symptoms and impaired breathing likely in active children and adults and people with lung disease, such as asthma; increasing likelihood of respiratory effects in general population.");
		suggestions["aqi"]["suggestions"].push("Avoid excessive idling of your automobile.");
		suggestions["ozone"]["healthRisks"].push("Increasing likelihood of respiratory symptoms and breathing discomfort in active children and adults and people with lung disease, such as asthma");
		suggestions["ozone"]["suggestions"].push("Defer lawn and gardening chores that use gasoline-powered equipment, or wait until evening.");
		suggestions["ozone"]["suggestions"].push("Choose a cleaner commute - share a ride to work or use public transportation.");	
	}

	if((pm25>50 && pm25<=100) || (pm10>50 && pm10<=100)){
		suggestions["aqi"]["healthRisks"].push("Possible aggravation of heart or lung disease in people with cardiopulmonary disease and older adults.");
		suggestions["aqi"]["suggestions"].push("Reduce the number of trips you take in your car.");
		suggestions["pm25"]["healthRisks"].push("Possible aggravation of heart or lung disease in people with cardiopulmonary disease and older adults.");
		suggestions["pm25"]["suggestions"].push("Reduce the number of trips you take in your car.");
		suggestions["pm10"]["healthRisks"].push("Possible aggravation of heart or lung disease in people with cardiopulmonary disease and older adults.");
		suggestions["pm10"]["suggestions"].push("Reduce the number of trips you take in your car.");
	}

	else if((pm25>100 && pm25<=200) || (pm10>100 && pm10<=200)){
		suggestions["aqi"]["healthRisks"].push("Aggravation of heart or lung disease in people with cardiopulmonary disease and older adults.");
		suggestions["aqi"]["suggestions"].push("Reduce the number of trips you take in your car.");
		suggestions["aqi"]["suggestions"].push("Avoid burning leaves, trash, and other materials.");
		suggestions["pm25"]["healthRisks"].push("Aggravation of heart or lung disease in people with cardiopulmonary disease and older adults.");
		suggestions["pm25"]["suggestions"].push("Reduce the number of trips you take in your car.");
		suggestions["pm25"]["suggestions"].push("Avoid burning leaves, trash, and other materials.");
		suggestions["pm10"]["healthRisks"].push("Aggravation of heart or lung disease in people with cardiopulmonary disease and older adults.");
		suggestions["pm10"]["suggestions"].push("Reduce the number of trips you take in your car.");
		suggestions["pm10"]["suggestions"].push("Avoid burning leaves, trash, and other materials.");	
	}

	else if(pm25>200 || pm10>200){
		suggestions["aqi"]["healthRisks"].push("High concentration of particulate matter. Might aggravate lung and heart problems");
		suggestions["aqi"]["suggestions"].push("Reduce the number of trips you take in your car.");
		suggestions["aqi"]["suggestions"].push("Avoid burning leaves, trash, and other materials.");
		suggestions["aqi"]["suggestions"].push("Reduce or eliminate fireplace and wood stove use.");
		suggestions["pm25"]["healthRisks"].push("High concentration of particulate matter. Might aggravate lung and heart problems");
		suggestions["pm25"]["suggestions"].push("Reduce the number of trips you take in your car.");
		suggestions["pm25"]["suggestions"].push("Avoid burning leaves, trash, and other materials.");
		suggestions["pm25"]["suggestions"].push("Reduce or eliminate fireplace and wood stove use.");
		suggestions["pm10"]["healthRisks"].push("High concentration of particulate matter. Might aggravate lung and heart problems");
		suggestions["pm10"]["suggestions"].push("Reduce the number of trips you take in your car.");
		suggestions["pm10"]["suggestions"].push("Avoid burning leaves, trash, and other materials.");		
		suggestions["pm10"]["suggestions"].push("Reduce or eliminate fireplace and wood stove use.");
	}

	if(no2>50 && no2<100){
		suggestions["aqi"]["healthRisks"].push("Slightly higher concentration of nitrigen dioxide. Might increase coughing and inflammation of the airways.");
		suggestions["aqi"]["suggestions"].push("Reduce automobile usage.");
		suggestions["nitrogenDioxide"]["healthRisks"].push("Slightly higher concentration of nitrigen dioxide. Might increase coughing and inflammation of the airways.");
		suggestions["nitrogenDioxide"]["suggestions"].push("Reduce automobile usage.");
	}

	else if(no2>100 && no2<=200){
		suggestions["aqi"]["healthRisks"].push("Concentration of nitrigen dioxide is on the higher side. Might increase coughing and inflammation of the airways.");
		suggestions["aqi"]["suggestions"].push("Reduce automobile usage.");		
		suggestions["nitrogenDioxide"]["healthRisks"].push("Concentration of nitrigen dioxide is on the higher side. Might increase coughing and inflammation of the airways.");
		suggestions["nitrogenDioxide"]["suggestions"].push("Reduce automobile usage.");	
	}

	else if(no2>200){
		suggestions["aqi"]["healthRisks"].push("High concentration of nitrigen dioxide. Increased coughing and inflammation of the airways highly likely. Increased susceptibility to respiratory infection, such as influenza");
		suggestions["aqi"]["suggestions"].push("Reduce automobile usage.");
		suggestions["aqi"]["suggestions"].push("Reduce usage ofnitrogen based fertilizer.");		
		suggestions["nitrogenDioxide"]["healthRisks"].push("High concentration of nitrigen dioxide. Increased coughing and inflammation of the airways highly likely. Increased susceptibility to respiratory infection, such as influenza.");
		suggestions["nitrogenDioxide"]["suggestions"].push("Reduce automobile usage.");	
		suggestions["nitrogenDioxide"]["suggestions"].push("Reduce usage of nitrogen based fertilizer.");		
	}

	if(co>50 && co<=100){
		suggestions["aqi"]["healthRisks"].push("Slightly high concentration of carbon monoxide. Might cause chest pain under increased physical activity.");
		suggestions["aqi"]["suggestions"].push("Check your surroundings. Something might be burning. Ventilate the area by opening the doors and windows.");
		suggestions["carbonMonoxide"]["healthRisks"].push("Slightly high concentration of carbon monoxide. Might cause chest pain under increased physical activity.");
		suggestions["carbonMonoxide"]["suggestions"].push("Check your surroundings. Something might be burning. Ventilate the area by opening the doors and windows.");
	}

	else if(co>100 && co<=200){
		suggestions["aqi"]["healthRisks"].push("High concentration of carbon monoxide. Might cause chest pain under increased physical activity due to reduced amount of oxygen in blood.");
		suggestions["aqi"]["suggestions"].push("Check your surroundings. Something might be burning. Ventilate the area by opening the doors and windows.");
		suggestions["carbonMonoxide"]["healthRisks"].push("High concentration of carbon monoxide. Might cause chest pain under increased physical activity due to reduced amount of oxygen in blood.");
		suggestions["carbonMonoxide"]["suggestions"].push("Check your surroundings. Something might be burning. Ventilate the area by opening the doors and windows.");
	}

	else if(co>200){
		suggestions["aqi"]["healthRisks"].push("Very high concentration of carbon monoxide.High chances of chest pain under increased physical activity. Could be fatal due to decreased amount of oxygen in blood.");
		suggestions["aqi"]["suggestions"].push("Check your surroundings. Something might be burning. Ventilate the area by opening the doors and windows. Leave the area and move to an open ventilated environment.");
		suggestions["carbonMonoxide"]["healthRisks"].push("Very High concentration of carbon monoxide. High chances of chest pain under increased physical activity. Could be fatal due to decreased amount of oxygen in blood.");
		suggestions["carbonMonoxide"]["suggestions"].push("Check your surroundings. Something might be burning. Ventilate the area by opening the doors and windows.Leave the area and move to an open ventilated environment.");
	}

	return suggestions;

}



//throatcancer,bronchitis,eyeinfections,emphysema,tissueinflammation,nervoussystemdisorders,chronicheartdisease,headache,nausea,irregularheartbeat
var getSuggestions = function(healthCond,age,gasSequence,aqiValues){
	var suggestions = initSuggestions(gasSequence);
	for(var i = 0; i < healthCond.length; i++){
		switch(healthCond[i]){
			case "exercise": suggestions = getSuggExercise(aqiValues,suggestions);break;	
			case "dustAllergy" : suggestions = getSuggDustAllergy(aqiValues,suggestions);break;
			case "asthma" : suggestions = getSuggAsthma(aqiValues,suggestions);break;
			case "headache" : suggestions = getSuggHeadache(aqiValues,suggestions);break;
			case "heartDisease" : suggestions = getSuggHeartDisease(aqiValues,suggestions);break;
			case "chronicCoughing" : suggestions = getSuggCough(aqiValues,suggestions);break;
			default:break;
		}
	}
	suggestions = getSuggAge(aqiValues,suggestions,age);
	suggestions = getSuggGeneral(aqiValues,suggestions);
	return suggestions;
}


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

var initSuggestions = function(gasSequence){
	var suggestions = {};
	for (var i = 0; i < gasSequence.length; i++) {
		suggestions[gasSequence[i]] = {}; 
		suggestions[gasSequence[i]]["healthRisks"] = [];
		suggestions[gasSequence[i]]["suggestions"] = [];	
	};
	return suggestions;
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
