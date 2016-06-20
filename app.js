

var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



///Routes
var rout = require('./routes/index');
var users = require('./routes/users');
var AppData = require( path.join(__dirname , '/routes/App/AppData.js'));
var AppReg = require( path.join(__dirname , '/routes/App/AppRegistration'));
var Website  = require( path.join(__dirname , '/routes/Website/Web'));
var AppDevice = require( path.join(__dirname ,'/routes/App/AppDevice'));

///Database




//var 













// view engine setup

app.engine('html', require('hogan-express'));
app.enable('view cache');
app.set('views',  path.join(__dirname , '/views'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


//Routes
app.use('/', rout);
app.use('/users', users);
app.use('/api/app/register',AppReg);
app.use('/api/app',AppData);
app.use('/website',Website);
app.use('/api/device',AppDevice);



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
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



app.route('/').get( function (req,res,next) {
    res.render('index',{});


})










module.exports = app;
