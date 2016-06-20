/**
 * Created by Himanshu Sagar on 16-06-2016.
 */
var express = require('express');
var router = express.Router();

var path = require('path');
var databaseJS = require( path.join( path.dirname(  path.dirname(__dirname ))  ,"/database/Database"));





router.post('/', function (req, res) {
    
    console.log(" app device Post");
   
    var reqData = new Array();
    console.log("---------------");
    console.log(req.body);
    console.log("---------------");
    reqData["deviceId"] = req.body.deviceId;
    
    reqData["nitrogenDioxide"] = getIndex("nitrogenDioxide",req.body.nitrogenDioxide);
    reqData["ozone"] = getIndex("ozone",req.body.ozone);
    reqData["pm10"] = getIndex("pm10",req.body.pm10);
    reqData["pm25"] = getIndex("pm25",req.body.pm25);
    reqData["carbonMonoxide"] = getIndex("carbonMonoxide",req.body.carbonMonoxide);
    reqData["humidity"]=req.body.humidity;
    reqData["temperature"]=req.body.temperature;
    reqData["location"] = req.body.location;
    databaseJS.dbInsertLatest(reqData);
    console.log("---------------------------------------------");
    console.log(reqData);
    console.log("---------------------------------------------");
    res.json([
        {
            response: "Data reached the server successfully",
        }
    ]);
});

router.get('/', function (req, res) {
    console.log('api device get');
    
    res.json([
        {
            response: "Data reached the server successfully",
        }
    ]);
});


module.exports = router;
