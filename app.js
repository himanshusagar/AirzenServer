

var express = require('express');
var app = express();
var path = require('path');
//var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var url = require('url');


var session = require('express-session');

var passport = require('passport');
var LocalStrategy = require('passport-json').Strategy;


//require('./config/passport')(passport);



///Routes
var rout = require('./routes/index');
var users = require('./routes/users');
var AppData = require( path.join(__dirname , '/routes/App/AppData.js'));
var DevIns = require( path.join(__dirname , '/routes/App/AppRegDevIns'));
var Website  = require( path.join(__dirname , '/routes/Website/Web'));
var DevData = require( path.join(__dirname ,'/routes/App/DeviceData'));
//var AppAuth = require(  path.join(__dirname ,'/routes/App/AppAuth') );

///Database

var initi = require(path.join(__dirname , '/database/Init'));
var DBAuth = require(path.join(__dirname , '/database/DBAuth'));



//var 











// view engine setup

app.engine('html', require('hogan-express'));
app.enable('view cache');
app.set('views',  path.join(__dirname , '/views'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(morgan('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
    session(
    {
        secret : 'Se@#CT',
        saveUninitialized: true,
        resave: true
    }

))

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


passport.use(
    new LocalStrategy(
        {
            usernameProp : 'emailId',
            passwordProp : 'token',
            passReqToCallback : true },
        function(req , username, password, done) 
        {

            
            DBAuth.AuthenticateIdentifier_Token(req,username,password,done)
            
          /*  // Fake user definition, just a sample.
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
            */
        })
);

passport.serializeUser( function(userObject, done)
{
    console.log(userObject);
    return done(null, userObject.token);
});

passport.deserializeUser( function( Token , done) {

    var userObject = {name: Token , password: Token };
    
    DBAuth.Deserialization(Token , done);

    //return done(null, userObject );
});






//Routes
app.use('/', rout);
app.use('/users', users);
app.use('/api/app/register',DevIns);
app.use('/api/app',AppData);
app.use('/website',Website);
app.use('/api/device',DevData);
//app.use('/api/app/auth',AppAuth);

app.post('/api/app/auth', passport.authenticate('json',
    {
        
        failureRedirect: '/api/app/authFailed',
  }),
    function(req, res)
    {
        console.log('Loged In as '+ req.user.token + " ///" + req.body.token + req.isAuthenticated());


        if(req.session.InitiallyCalledAs != undefined && req.session.InitiallyCalledAs!=null)
            res.redirect(307 , req.session.InitiallyCalledAs);
        else
        {
            var Object =
            {
                token : null,
                emailId : null,
                isValidated : true
            }
            res.send(Object);
        }
    });





app.get('/api/app/authFailed',function (req,res) {
    res.send(404);

} )

/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


// production error handler
// no stacktraces leaked to user

app.use(function(err, req, res, next)
{
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



*/


module.exports = app;