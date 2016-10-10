/**
 * Created by Himanshu Sagar on 18-06-2016.
 */



var GAS_ARRAY = new Array();
GAS_ARRAY['0'] = 'aqi';
GAS_ARRAY[1] = 'nitrogenDioxide';
GAS_ARRAY[2] = 'ozone' ;
GAS_ARRAY[3] ='pm25';
GAS_ARRAY[4] ='pm10';
GAS_ARRAY[5]= 'carbonMonoxide';
//GAS_ARRAY[6] = 'temperature' ;
//GAS_ARRAY[7] = 'humidity' ;


var JSON_ARRAY = new Array();
JSON_ARRAY['0'] = 'aqi';
JSON_ARRAY[1] = 'nitrogenDioxide';
JSON_ARRAY[2] = 'ozone' ;
JSON_ARRAY[3] ='pm25';
JSON_ARRAY[4] ='pm10';
JSON_ARRAY[5]= 'carbonMonoxide';
JSON_ARRAY[6] = 'temperature' ;
JSON_ARRAY[7] = 'humidity' ;




module.exports =
{
    PAST_HOUR_ENTRIES : 5,
    PAST_DAY_ENTRIES : 5 ,
    PAST_WEEK_ENTRIES : 5 ,
    PAST_MONTH_ENTRIES : 5 ,
    MONTHLY_ENTRIES : 5,
    pastHour : 'pastHour',
    pastWeek : 'pastWeek',
    pastDay : 'pastDay',
    pastMonth : 'pastMonth',
    monthly : 'monthly',
    devices : "devices",
    users : "users",
    registrationsTableName : 'registrations',
    GAS_AQI : "aqi",
    CARBON_MX : "carbonMonoxide", 
    NITROGEN_DX : 'nitrogenDioxide',
    PM_25 : 'pm25',
    PM_10 : 'pm10',
    OZONE : "ozone",
    TEMP : "temperature",
    HUMIDITY : "humidity",
    healthRisks : "healthRisks",
    suggestions : "suggestions",
    GAS_ARRAY : GAS_ARRAY,
    JSON_ARRAY : JSON_ARRAY,
    signUpMessage : "signUpMessage",
    dataDump : "dataDump"
}
