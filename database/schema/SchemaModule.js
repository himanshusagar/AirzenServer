
/**
 * Created by Himanshu Sagar on 17-06-2016.
 */


var path = require('path');
var tC = require(path.join( path.dirname( __dirname) , '/TimeCal'));
var f = require(path.join(__dirname , '/Flag'));


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var constants = require( path.join( path.dirname( path.dirname(__dirname)) , '/Constants') );

var DevicesSchema = new Schema({

    passKey : String,
    deviceId : {type : String , unique:true}
})

var UsersSchema = new Schema({

    token : String,
    deviceId : String,
    identifier : String
})

var InferencesSchema = new Schema({

    inferences : [String]


})
var EntrySchema = new Schema({

    date : Date,
    val : Number
})


var pastHourSchema = new Schema({

    regId : Schema.Types.ObjectId,
    gasType : String,
    latest : Number,
    array : [EntrySchema]

})
var pastDaySchema = new Schema({

    regId : Schema.Types.ObjectId,
    gasType : String,
    latest : Number,
    array : [EntrySchema]

})

var pastWeekSchema = new Schema({

    regId : Schema.Types.ObjectId,
    gasType : String,
    latest : Number,
    array : [EntrySchema]

})


var pastMonthSchema = new Schema({

    regId : Schema.Types.ObjectId,
    gasType : String,
    latest : Number,
    array : [EntrySchema]

})
var monthlySchema = new Schema({

    regId : Schema.Types.ObjectId,
    gasType : String,
    latest : Number,
    array : [EntrySchema]

})





var gasSpecificSchema = new Schema({

    regId : Schema.Types.ObjectId,
    gasType : String,
    concentration: Number,
    pastDay : {type:[Number] , required : true},
    pastWeek : {type:[Number] , required : true},
    pastMonth : {type:[Number] , required : true},
    monthly : {type:[Number] , required : true}
    //healthRiskId : Schema.Types.ObjectId,
    //suggestionsID : Schema.Types.ObjectId

})

var registrationSchema = new Schema({

    deviceId : { type:String , unique:true },
    token : { type:String , unique:true },
    emailId : String,
    regDate : Date,
    




})

var healthRiskSchema = new Schema({

    array : [String]

})

var suggestionsSchema = new Schema({
    array : [String]
})


var registrationModel = mongoose.model('registration' , registrationSchema , constants.registrationsTableName );
var gasSpecificModel = mongoose.model('gasSpecific' , gasSpecificSchema , constants.gasSpecific);
var pastHourModel = mongoose.model('pastHour' , pastHourSchema , constants.pastHour)
var EntryModel = mongoose.model('entry',EntrySchema);
var pastDayModel = mongoose.model('pastDay' , pastDaySchema , constants.pastDay);
var pastWeekModel = mongoose.model('pastWeek' , pastWeekSchema , constants.pastWeek);
var pastMonthModel = mongoose.model('pastMonth' , pastMonthSchema , constants.pastMonth);
var monthlyModel = mongoose.model('monthly' , monthlySchema ,constants.monthly);
var devicesModel  = mongoose.model('devices' , DevicesSchema , constants.devices);
var usersModel = mongoose.model('user' , UsersSchema , constants.users);


registrationSchema.post('save' , function (doc)
{
    console.log( doc.regDate);
    for (var i = 0; i < constants.GAS_ARRAY.length; i++)
    {
        getObject(constants.GAS_ARRAY[i] , doc._id , pastHourModel).save(function (err) {
            if(err)
            {
                console.log('past hour initialisation error');
            }



        })
        getObject(constants.GAS_ARRAY[i] , doc._id , pastDayModel).save(function (err) {
            if(err)
            {
                console.log('past Day initialisation error');
            }



        })
        getObject(constants.GAS_ARRAY[i] , doc._id, pastWeekModel).save(function (err) {
            if(err)
            {
                console.log('past Week initialisation error');
            }

        })
        getObject(constants.GAS_ARRAY[i] , doc._id, pastMonthModel).save(function (err) {
            if(err)
            {
                console.log('past Month initialisation error');
            }

        })
        getObject(constants.GAS_ARRAY[i] , doc._id, monthlyModel).save(function (err) {
            if(err)
            {
                console.log('Monthly initialisation error');
            }

        })





    }







})



pastHourSchema.post('save' , function (phObj)
{
    
    
    if(phObj!=null && phObj!=undefined && phObj.array!=null && phObj.array!=undefined
    && phObj.array.length >= 1 && phObj.array[0]!=undefined && phObj.array[0]!=null)
    {
        var oldestTimeStampIndex = tC.getOldestIndex(phObj);

        var diff = (  ((new Date).getHours()) - phObj.array[oldestTimeStampIndex].date.getHours()) ;



        if(diff >= 1 || true)
        {
            var dataValue = tC.getArrayAvg(phObj.array);

            var dateDalo = phObj.array[oldestTimeStampIndex].date;

           /* console.log( 'diff is'  + diff  + " " +((new Date).getHours()) + " "
                + phObj.array[oldestTimeStampIndex].date.getHours() + " " +phObj.array[oldestTimeStampIndex]._id
                + "val = " + +phObj.array[oldestTimeStampIndex].date+ " dataVAl" + dataValue
            );
            */

            pastDayModel.findOne( {deviceId : phObj.deviceId , gasType : phObj.gasType} , function (err , Obj) 
            {
                var rowId = Obj.id;
                var flag = true;
                
                if(Obj == null)
                {
                    console.log("Database Error");
                }
                
                if(Obj!=null && Obj!=undefined && Obj.array!=null && Obj.array!=undefined
                    && Obj.array.length >= 1 && Obj.array[0]!=undefined && Obj.array[0]!=null)
                {
                    
                    var oTSI = tC.getOldestIndex(Obj);
                    
                    if( tC.CheckSameTS_exceptHour(dateDalo , Obj) )
                        flag = false;
                    
                
                }
                if(flag || f.f) 
                    pastDayModel.findById(rowId , function (err, pdObj)
                    {

                        updateObject(pdObj , dataValue , constants.PAST_DAY_ENTRIES , dateDalo ,err ,EntryModel);

                    })
                
            })
            
        }

    }

})




pastDaySchema.post('save' , function (pdObj)
{
    if(pdObj!=null && pdObj!=undefined && pdObj.array!=null && pdObj.array!=undefined
        && pdObj.array.length >= 1 && pdObj.array[0]!=undefined && pdObj.array[0]!=null)
    {
        var oldestTimeStampIndex = tC.getOldestIndex(pdObj);

        var diff = (  ((new Date).getDay()) - pdObj.array[oldestTimeStampIndex].date.getDay()) ;



        if(diff >= 1 || true)
        {
            var dataValue = tC.getArrayAvg(pdObj.array);

            var dateDalo = pdObj.array[oldestTimeStampIndex].date;

            /* console.log( 'diff is'  + diff  + " " +((new Date).getHours()) + " "
             + pdObj.array[oldestTimeStampIndex].date.getHours() + " " +pdObj.array[oldestTimeStampIndex]._id
             + "val = " + +pdObj.array[oldestTimeStampIndex].date+ " dataVAl" + dataValue
             );
             */

            pastWeekModel.findOne( {deviceId : pdObj.deviceId , gasType : pdObj.gasType} , function (err , Obj)
            {
                var rowId = Obj.id;
                var flag = true;

                if(Obj == null)
                {
                    console.log("Database Error");
                }

                if(Obj!=null && Obj!=undefined && Obj.array!=null && Obj.array!=undefined
                    && Obj.array.length >= 1 && Obj.array[0]!=undefined && Obj.array[0]!=null)
                {

                    var oTSI = tC.getOldestIndex(Obj);

                    if( tC.CheckSameTS_exceptDay(dateDalo , Obj) )
                        flag = false;


                }
                if(flag || f.f)
                    pastWeekModel.findById(rowId , function (err, pwObj)
                    {

                        updateObject(pwObj , dataValue , constants.PAST_WEEK_ENTRIES , dateDalo ,err ,EntryModel);

                    })

            })

        }

    }

})

pastWeekSchema.post('save', function (pwObj) 
{
    if(pwObj!=null && pwObj!=undefined && pwObj.array!=null && pwObj.array!=undefined
        && pwObj.array.length >= 1 && pwObj.array[0]!=undefined && pwObj.array[0]!=null)
    {
        var oldestTimeStampIndex = tC.getOldestIndex(pwObj);

        var diff = 1; 
        // if changed modify CheckSameTS_excepyDay as well
        if(diff >= 1 || true)
        {
            var dataValue = tC.getArrayAvg(pwObj.array);

            var dateDalo = pwObj.array[oldestTimeStampIndex].date;

            /* console.log( 'diff is'  + diff  + " " +((new Date).getHours()) + " "
             + pwObj.array[oldestTimeStampIndex].date.getHours() + " " +pwObj.array[oldestTimeStampIndex]._id
             + "val = " + +pwObj.array[oldestTimeStampIndex].date+ " dataVAl" + dataValue
             );
             */

            pastMonthModel.findOne( {deviceId : pwObj.deviceId , gasType : pwObj.gasType} , function (err , Obj)
            {
                var rowId = Obj.id;
                var flag = true;

                if(Obj == null)
                {
                    console.log("Database Error");
                }

                if(Obj!=null && Obj!=undefined && Obj.array!=null && Obj.array!=undefined
                    && Obj.array.length >= 1 && Obj.array[0]!=undefined && Obj.array[0]!=null)
                {

                    var oTSI = tC.getOldestIndex(Obj);

                    if( tC.CheckSameTS_exceptDay(dateDalo , Obj) )
                        flag = false;


                }
                if(flag || f.f)
                    pastMonthModel.findById(rowId , function (err, pmObj)
                    {

                        updateObject(pmObj , dataValue , constants.PAST_MONTH_ENTRIES , dateDalo ,err ,EntryModel);

                    })

            })

        }

    }


})

pastMonthSchema.post('save' , function (pmObj) 
{
    if(pmObj!=null && pmObj!=undefined && pmObj.array!=null && pmObj.array!=undefined
        && pmObj.array.length >= 1 && pmObj.array[0]!=undefined && pmObj.array[0]!=null)
    {
        var oldestTimeStampIndex = tC.getOldestIndex(pmObj);

        var diff = (  ((new Date).getMonth()) - pmObj.array[oldestTimeStampIndex].date.getMonth()) ;

        if(diff >= 1 || true)
        {
            var dataValue = tC.getArrayAvg(pmObj.array);

            var dateDalo = pmObj.array[oldestTimeStampIndex].date;

            /* console.log( 'diff is'  + diff  + " " +((new Date).getHours()) + " "
             + pmObj.array[oldestTimeStampIndex].date.getHours() + " " +pmObj.array[oldestTimeStampIndex]._id
             + "val = " + +pmObj.array[oldestTimeStampIndex].date+ " dataVAl" + dataValue
             );
             */

            monthlyModel.findOne( {deviceId : pmObj.deviceId , gasType : pmObj.gasType} , function (err , Obj)
            {
                var rowId = Obj.id;
                var flag = true;

                if(Obj == null)
                {
                    console.log("Database Error");
                }

                if(Obj!=null && Obj!=undefined && Obj.array!=null && Obj.array!=undefined
                    && Obj.array.length >= 1 && Obj.array[0]!=undefined && Obj.array[0]!=null)
                {

                    var oTSI = tC.getOldestIndex(Obj);

                    if( tC.CheckSameTS_exceptMonth(dateDalo , Obj) )
                        flag = false;


                }
                if(flag || f.f)
                    monthlyModel.findById(rowId , function (err, monthlyObj)
                    {

                        updateObject(monthlyObj , dataValue , constants.MONTHLY_ENTRIES , dateDalo ,err ,EntryModel);

                    })

            })

        }

    }



})



var getObject =function (type , regId ,Model ) {

    var toBeInserted = new Model({

        latest: 0,
        regId: regId,
        gasType: type,
        array: []


    })
    return toBeInserted;
}


var updateObject = function ( Object, dataValue , ENTRIES_LIMIT, dateValue, err , Model)
{
    if (!err || Object != null || Object != undefined)
    {
        if (Object.array == undefined)
        {
            console.log('Array Undefined ');
            Object.array = new Array();
        }

        if (Object.array != undefined && Object.array.length >= ENTRIES_LIMIT)
        {
            console.log("puling");
            var eleId = tC.getOldestObjectId(Object);

            Object.array.pull({_id :eleId});



        }
        Object.latest = Math.ceil(dataValue );
        console.log('inserting' + Object.latest);

        var dalo = new Model({
            date : dateValue,
            val : Object.latest
        })
        Object.array.push
        (
            dalo
        );

        Object.save(function (err)
        {
            if (err)
                throw err;
            console.log("saved");

        });

    }
    else
        console.log("khali");


}


module.exports = {


    registrationModel  : registrationModel  ,
    pastHourModel : pastHourModel,
    entryModel : EntryModel,
    pastDayModel : pastDayModel,
    pastWeekModel : pastWeekModel,
    pastMonthModel : pastMonthModel,
    monthlyModel : monthlyModel,
    devicesModel : devicesModel,
    usersModel : usersModel

}

