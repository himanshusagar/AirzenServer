/**
 * Created by Himanshu Sagar on 17-06-2016.
 */

var mongoose = require('mongoose');

var path = require('path');

console.log( (__dirname) + path.dirname(__dirname));


/*
var db = mongoose.connect('mongodb://localhost/testing');

var schema = new mongoose.Schema({ name: String});

var Tank = mongoose.model('Tank', schema, 'tanks');


var small = new Tank({ name: 'smallo' });

small.save(function (err) {
    if (err)
    {
        console.log(err);
        throw err;
        //callback(err,JSON.stringify({response:"error"}));
    }
    console.log('saved');
    // saved!
})


Tank.find({ name: 'smallo' },function (err , tank) {
    if (err)
    {
        console.log(err);
        callback(err, JSON.stringify({response: "error"}));
    }
    else
    {
        console.log(tank);

    }

})

*/




