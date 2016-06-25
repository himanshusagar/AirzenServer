/**
 * Created by Himanshu Sagar on 23-06-2016.
 */

var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-json').Strategy;

var flash = require('connect-flash');

var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    session({
    saveUninitialized : true,
    secret : 'Some Secret' ,
    resave : true
}));

app.use( passport.initialize());
app.use( passport.session());
app.use(flash());


// Authentication
passport.use(
    new LocalStrategy(
        {  passReqToCallback : true },
        function(req , username, password, done) {

            // Fake user definition, just a sample.
            var userObject = {name: 'fake', password: 'fake'};
            console.log( "username" + username + "  "+ 'password' + password);

            // Here you can put your async authentication method from db
            if(userObject.name === username && userObject.password === password)
            {
                console.log("pased");
                return done(null, userObject);
            }
            else
            {
                console.log("Failed")
                return done(null, false,{});
            }
        })
);

passport.serializeUser( function(userObject, done)
{
    console.log(userObject);
    return done(null, userObject.name);
});

passport.deserializeUser( function( nameId , done) {

    var userObject = {name: nameId , password: nameId };

    return done(null, userObject );
});

app.get('/', function(req, res) {

    var htmlToSend = '';

    var error = req.flash('error')[0];

    if(error)
        htmlToSend += '<div style="background-color:red; width:30%;">' + error + '</div>';

    htmlToSend += '<form action="/login" method="post"> \
    <input name="username"/> \
    <input type="password" name="password"/> \
    <button> send \
  </form>';

    res.send(htmlToSend);
});


app.post('/login', passport.authenticate('json', {
        failureRedirect: '/',
        successFlash: 'Welcome!',
        failureFlash: 'User/Password Invalid!',
        session : false
    }),
    function(req, res)
    {
        console.log(req + " " + res);

        res.send('Loged In as '+ req.user.name + " ///" + req.userObject /* req.user.username */);
    });


app.listen(3000, function() {
    console.log('started');
});