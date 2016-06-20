/**
 * Created by Himanshu Sagar on 17-06-2016.
 */

var path = require('path');
var mongoose = require('mongoose');
var initi = require(path.join( __dirname , 'Init'));
var tC = require( path.join( __dirname ,'/TimeCal'));


//own module
var schemaModule = require(  path.join( __dirname ,'/schema/SchemaModule'));
var constants = require( path.join( path.dirname(__dirname) , '/Constants') );



console.log(path.join(__dirname ,'/schema/SchemaModule'));


var getAvg=function(rows,name){
    var count = 0;
    var sum = 0;
    for (var i = rows.length - 1; i >= 0; i--)
    {
        if(rows[i][name] != 0)
        {
            count++;
            sum+=rows[i][name];
        }
    }
    return sum/count;
}


var getAQI = function(I_low, I_high, C_low, C_high, C)
{
    return Math.ceil((((I_high - I_low)/(C_high - C_low))*(C - C_low)) + I_low);
}

var aqi =
{
    "ozone": [0.0237, 0.0473, 0.0795, 0.0984, 0.354],  //ppm
    "pm10":[50, 100, 250, 350, 430],      //microgram/metercube
    "pm25":[30, 60, 90, 120, 250],      //microgram/metercube
    "carbonMonoxide":[0.8, 1.62, 8.11, 13.8, 27.6],      //ppm
    "nitrogenDioxide":[0.0324, 0.0649, 0.146, 0.227, 0.324],        //ppm
    "aqi":[50, 100, 200, 300, 400, 500]
}

var getInferences = function(deviceId)
{
    var inferences = new Array();
    inferences[0] = "No inferences";
    return inferences;
}

function registerUser(deviceid,passkey,email)
{


    var regModel = schemaModule.registrationModel;

    var toBeInserted = new regModel({
        emailId : email,
        passKey : passkey,
        deviceId : deviceid,
        regDate : new Date()
    })


    regModel.findOne( { deviceId : deviceid}, function (err , obj) {

        if(err)
        {
            console.log("ERROR" + '\n' + err);
            json = JSON.stringify({"response":"Cannot read table registrations"});
            //callback(null,json);
        }
        else if(obj == null)
        {
            toBeInserted.save( function (err) {

                if (err)
                    console.log('fail to save');
                else
                {
                    console.log("User Registered");
                    //ext();
                }
            })
        }
        else
        {

            console.log("Already registered with a device");

        }


    } )


}

var dbSpecificInsert = function (dataValue , TYPE_OF_GAS, regID)
{
    schemaModule.pastHourModel.findOne({regId: regID, gasType: TYPE_OF_GAS }, function (err, Obj)
    {

        //console.log( "found" + dataValue);

        schemaModule.pastHourModel.findById(Obj.id, function (err, phObj)
        {

            if (!err || phObj != null || phObj != undefined)
            {


                if (phObj.array == undefined)
                {
                    console.log('Array Undefined');
                    phObj.array = new Array();
                }

                if (phObj.array != undefined && phObj.array.length == constants.PAST_HOUR_ENTRIES)
                {
                  //  console.log("puling");
                    var eleId = tC.getOldestObjectId(phObj);

                    phObj.array.pull({_id :eleId});

                

                }
                phObj.latest = Math.ceil(dataValue );
                //console.log('inserting' + phObj.latest);
                
                var dalo = new schemaModule.entryModel({
                    date : new Date,
                    val : phObj.latest
                })
                
                phObj.array.push
                (
                    dalo
                );

                phObj.save(function (err)
                {
                    if (err) throw err;
                   // console.log("saved");
                    
                });
            }
            else
                console.log("khali");


        })

    })


}


var dbInsertLatest = function(data)
{
    //connection.connect();
    var deviceId = data["deviceId"];
    var nitrogenDioxide = data["nitrogenDioxide"];
    var ozone = data["ozone"];
    var pm25 = data["pm25"];
    var pm10 = data["pm10"];
    var carbonMonoxide = data["carbonMonoxide"];
    var humidity = data["humidity"];
    var temperature = data["temperature"]; //Temp between -20 to 55
    var aqi = Math.max(nitrogenDioxide, ozone, pm10, pm25, carbonMonoxide);
    var location = data["location"];
    data["aqi"] = aqi;


    var pastHourModel = schemaModule.pastHourModel;

    schemaModule.registrationModel.findOne({deviceId: deviceId}, function (err, user)
    {
        var regID = user._id;

        for (var i = 0; i < constants.GAS_ARRAY.length; i++)
        {
            //console.log(constants.GAS_ARRAY[i]);
            dbSpecificInsert(data[constants.GAS_ARRAY[i]], constants.GAS_ARRAY[i] , regID);
        }
    })


}




//registerUser("A123",'goli','a@email.com');

reqData = new Array();
var maxAqi = new Array();
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

//closeDB.disconnect();