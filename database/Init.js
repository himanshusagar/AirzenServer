/**
 * Created by Himanshu Sagar on 19-06-2016.
 */
var path = require('path');
var mongoose = require('mongoose');


var databasePath = 'mongodb://127.0.0.1/AirzenProject';

console.log( path.join( path.dirname(__dirname) , '/Constants'));



var closeDB = mongoose.connect(databasePath);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:db'));

db.once('open', function()
{
    console.log("Connected with db");
});


