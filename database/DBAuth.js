/**
 * Created by Himanshu Sagar on 24-06-2016.
 */

var url = require('url');

var path = require('path');
var schemaModule = require(path.join( __dirname , '/schema/SchemaModule'));
var regModel = schemaModule.registrationModel;

function ensureAuthenticated(req, res, next)
{
    req.session.InitiallyCalledAs = req.url;
    console.log(req.isAuthenticated() + req.url);
    if(req.isAuthenticated())
    {
        
        return next();
    } else 
    {
        //req.flash('error_msg','You are not logged in');
        
        res.redirect(307,'/api/app/auth');
        
    }
}



var AuthenticateIdentifier_Token = function(req , username, password, done) 
{

    regModel.findOne( { emailId : username , token : password}, function (err , UserObj) 
    {

        if (!err && UserObj!=null )
        {
            done(null , UserObj);
        }
        else 
        {
            done(null,false);

        }
    })
}

var Deserialization = function ( Token , done)
{
    regModel.findOne( { token : Token }, function (err , UserObj)
    {

        if (!err && UserObj!=null )
        {
            done(null , UserObj);
        }
        else
        {
            done(null,false , {});

        }
    })


}
    
        
module.exports =
{
    AuthenticateIdentifier_Token : AuthenticateIdentifier_Token,
    Deserialization : Deserialization,
    ensureAuthenticated : ensureAuthenticated
}