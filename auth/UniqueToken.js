/**
 * Created by Himanshu Sagar on 23-06-2016.
 */


var node_uuid = require('node-uuid');

var generateToken = function () {

    var value  = node_uuid.v4();
    return value;

}

module.exports = {

    generateToken : generateToken
}