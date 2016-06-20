/**
 * Created by Himanshu Sagar on 19-06-2016.
 */

var path = require('path');

var schemaModule = require(  path.join( __dirname ,'/schema/SchemaModule'));

var constants = require( path.join( path.dirname(__dirname) , '/Constants') );

var hRS = require(path.join (__dirname , "/HealthRiskSugg"));



var gasSpecific = "gasSpecific";
var initi = require(path.join( __dirname , 'Init'));


var healthConditions = null;
var AGE = null;

var handleError = function () {
    console.log("Error");
}


var getGasSpecificObj = function()
{

    var xx = {};
    xx['gasType'] = "g";
    xx[constants.GAS_AQI] = 0;
    xx[constants.pastDay] = [];
    xx[constants.pastWeek] = [];
    xx[constants.pastMonth] = [];
    xx[constants.monthly] = [];
    xx[constants.healthRisks] = [];
    xx[constants.suggestions] = [];
    
    
    return xx;
}

var initialise = function ()
{
    var x = new Array();


    for (var i = 0 ; i < constants.GAS_ARRAY.length ; i++)
    {
        x[i]= getGasSpecificObj();
        x[i]['gasType'] = constants.GAS_ARRAY[i];

    }
    return x;

}

var setObjects = function(MainObj , Obj, gasType , index)
{
    var found = new Array();
    for (var i = 0 ; i < Obj.array.length ; i++)
    {
        found[i] = Obj.array[i].val;

    }
     return found;

}

var QueryModels = function (Model , ROW_TYPE, index ,gasInfo , regId ,gasType,callback)
{
    Model.findOne({regId: regId, gasType: gasType }, function (err, Obj)
    {
        if(Obj != null || !err)
        {
         //   console.log('i = ' + index + " " +'val = ' + gasType + ROW_TYPE);
            gasInfo[index][ROW_TYPE] = setObjects(gasInfo , Obj, gasType , index);

        }
        else
        {
            handleError()
        }
        if((index == constants.GAS_ARRAY.length - 1) && Model == schemaModule.monthlyModel)
        {

            if(healthConditions != null && AGE != null)
            {
                console.log("HC AGE not null");


                var aqiValues = {"aqi": 0, "nitrogenDioxide": 0, "ozone": 0, "pm25": 0, "pm10": 0, "carbonMonoxide": 0};


                for (var i = 0; i < gasInfo.length; i++) {
                    aqiValues[gasInfo[i]["gasType"]] = gasInfo[i][constants.GAS_AQI];
//                    console.log( aqiValues[ gasInfo[i]["gasType"] ] );

                }
                var gasSequence = ["aqi","nitrogenDioxide","ozone","pm25","pm10","carbonMonoxide","temperature","humidity"];

                var suggestions = hRS.getSuggestions(healthConditions, AGE, gasSequence , aqiValues);

                for (var i = 0; i < gasInfo.length; i++) 
                {
                    gasInfo[i][constants.healthRisks] = suggestions[gasInfo[i]["gasType"]][constants.healthRisks];
                    gasInfo[i][constants.suggestions] = suggestions[gasInfo[i]["gasType"]][constants.suggestions];
                }
                ;


            }
            else
                console.log("NULL found");
            
            json = JSON.stringify({"inferences": [], "gasSpecific": gasInfo});
            console.log('JSON-result:', json);
            callback(null, json);

        }

    })


}


var getAppJsonHelp = function (gasType,index,gasInfo ,regId,callback)
{


    schemaModule.pastHourModel.findOne( { regId : regId , gasType : gasType } ,function (err , Ob)
    {

        if(Ob!=null || !err)
        {
            gasInfo[index][constants.GAS_AQI] = Ob.latest;

        }
        else
        {

            handleError()

        }
    })


    QueryModels(schemaModule.pastDayModel ,constants.pastDay , index, gasInfo , regId ,gasType,callback)


   QueryModels(schemaModule.pastWeekModel ,constants.pastWeek , index, gasInfo , regId, gasType,callback)


    QueryModels(schemaModule.pastMonthModel ,constants.pastMonth , index, gasInfo , regId, gasType,callback)


    QueryModels(schemaModule.monthlyModel ,constants.monthly , index, gasInfo , regId, gasType,callback)



}

var getAppJson = function (deviceId , healthCond , age, callback) {
    var gasInfo = initialise();

    
    
    
    
    if (healthConditions == null && AGE==null)
    {
        healthConditions = healthCond;
        AGE = age;
        console.log("initialised")
    }





    schemaModule.registrationModel.findOne( {deviceId : deviceId} , function (err,Object)
    {
        if(err || Object==null)
            handleError();
        else
        {
            var regId = Object.id;



            for(var i = 0 ; i < constants.GAS_ARRAY.length ; i++)
            {
                getAppJsonHelp(constants.GAS_ARRAY[i] , i  , gasInfo , regId,callback);

            }






        }

       

    })
    
    





}

var print = function (gasInfo)
{
    console.log(gasInfo);

}

//getAppJson('A123' , null , null );

module.exports =
{
    getAppJson : getAppJson
}