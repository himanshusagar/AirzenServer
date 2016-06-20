/**
 * Created by Himanshu Sagar on 19-06-2016.
 */

var path = require('path');
var constants = require( path.join( path.dirname(__dirname) , '/Constants') );




var getOldestObjectId = function (Obj)
{
    var min = Obj.array[0].date;
    var minIndex = 0;

    for(var i = 0 ;i < Obj.array.length ; i++ )
    {
        if(min > Obj.array[i].date)
        {
            min = Obj.array[i].date;
            minIndex = i;
        }
    }
    //console.log('id' +  Obj.array[minIndex].id);
    
    return Obj.array[minIndex].id;
}

var getOldestIndex = function (Obj)
{
    var min = Obj.array[0].date;
    var minIndex = 0;

    for(var i = 0 ;i < Obj.array.length ; i++ )
    {
        if(min > Obj.array[i].date)
        {
            min = Obj.array[i].date;
            minIndex = i;
        }
    }
    //console.log('id' +  Obj.array[minIndex].id);

    return minIndex;
}


var getArrayAvg = function (array) 
{
    
    var sum = 0 ;
    for(var i = 0 ; i < array.length ; i++)
    {
        sum += array[i].val;
    }
    
    return Math.ceil(  sum/array.length);
    
}

var CheckSameTS_exceptHour = function (date , array)
{

    for(var i = 0;i<array.length ; i++ )
    {
        if(CheckHourExist(date , array[i].date))
        {
            return true;
        }
    }
    return false;

}


var CheckHourExist = function (A , B) {

    if(A.getFullYear() == B.getFullYear()
    && A.getMonth() == B.getMonth()
    && A.getDay() == B.getDay()
    && A.getHours() != B.getHours()
    )
    {
        return true;
    }
    else
        return false;
}

var CheckDayExist = function (A , B) {

    if(A.getFullYear() == B.getFullYear()
        && A.getMonth() == B.getMonth()
        && A.getDay() != B.getDay()
    )
    {
        return true;
    }
    else
        return false;
}



var CheckMonthExist = function (A , B) {

    if(A.getFullYear() == B.getFullYear()
        && A.getMonth() != B.getMonth()
    )
    {
        return true;
    }
    else
        return false;
}


var CheckSameTS_exceptMonth = function (date , array)
{

    for(var i = 0;i<array.length ; i++ )
    {
        if(CheckMonthExist(date , array[i].date))
        {
            return true;
        }
    }
    return false;

}


var CheckSameTS_exceptDay = function (date , array)
{

    for(var i = 0;i<array.length ; i++ )
    {
        if(CheckDayExist(date , array[i].date))
        {
            return true;
        }
    }
    return false;

}


module.exports = 
{
    getOldestIndex : getOldestIndex,
    getOldestObjectId : getOldestObjectId,
    getArrayAvg : getArrayAvg,
    CheckSameTS_exceptHour : CheckSameTS_exceptHour,
    CheckSameTS_exceptDay : CheckSameTS_exceptDay,

    CheckSameTS_exceptMonth : CheckSameTS_exceptMonth

}

