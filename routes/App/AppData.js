var express = require('express');
var router = express.Router();
var path = require('path');

var sJ = require( path.join( path.dirname(  path.dirname(__dirname ))  ,"/database/ServeJSON"));


// App Data

router.post("/", function(req, res){
    
    console.log('appData POst');
    
    var reqData = new Array();
    reqData["deviceId"] = req.body.deviceId;
    reqData["age"] = req.body.age;
    reqData["defectPreferences"] = req.body.defectPreferences;

    console.log(reqData);

    sJ.getAppJson("A123",reqData["defectPreferences"],reqData["age"] ,function (err , result) 
    {
        res.writeHead(200, {
            'Content-Type' : 'x-application/json'
        });
        res.end(result);


    });
    
    /*getSQL("A123",reqData["defectPreferences"],reqData["age"],function(err, result)
     {
        res.writeHead(200, {
            'Content-Type' : 'x-application/json'
        });
        res.end(result);
    });
    */
    //console.log(resJson);
    //console.log(req.body);

})

router.get("/", function(req, res)
{
    console.log('appData Get');

    var reqData = new Array();
    reqData["deviceId"] = "A123";
    reqData["age"] = 10;
    reqData["defectPreferences"] = ["asthma"];
    //console.log(reqData);
    
    /*getSQL("A123",reqData["defectPreferences"],reqData["age"],function(err, result) {
        res.writeHead(200, {
            'Content-Type' : 'x-application/json'
        });
        res.end(result);
    });
    */
    //console.log(resJson);
    //console.log(req.body);
})


module.exports = router;