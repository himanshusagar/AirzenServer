var express = require('express');
var router = express.Router();
var path = require('path');
var databaseJS = require( path.join( path.dirname(  path.dirname(__dirname ))  ,"/database/Database"));



//Registration of Device
// it will also store values for device;

router.post("/", function(req, res)
{
    console.log('post of Register');
    var reqData = new Array();
    var deviceId = reqData["deviceId"] = req.body.deviceId;
    var passKey = reqData["passKey"] = req.body.passKey;
    var identifier = reqData["email"] = req.body.email;
    console.log(reqData);

    
    databaseJS.CheckDeviceId_PassKey(deviceId , passKey ,identifier ,function(err, result) {
        res.writeHead(200, {
            'Content-Type': 'x-application/json'
        });

        console.log(result);
        res.end(result);
    })

})

router.get('/' , function (req,res) {
    res.send("Inside Get");
})


module.exports = router;

