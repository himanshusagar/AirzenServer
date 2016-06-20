var express = require('express');
var router = express.Router();

//Registration of Device
router.post("/", function(req, res)
{
    console.log('post of Register');
    var reqData = new Array();
    reqData["deviceId"] = req.body.deviceId;
    reqData["passkey"] = req.body.passkey;
    reqData["email"] = req.body.email;
    //console.log(reqData);
    /*registerUser(reqData["deviceId"],reqData["passkey"],reqData["email"],function(err, result) {
        res.writeHead(200, {
            'Content-Type' : 'x-application/json'
        });
        res.end(result);
    });
    */

})


module.exports = router;

