var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//
// // TODO 添加数据库 orm
// //mysql://root:lanyan324@47.95.241.170:3306/ngwf
// app.use(orm.express("mysql://root:lanyan324@47.95.241.170:3306/ngwf", {
//     define: function (db, models, next) {
//         models.Task = db.define("Task", {
//             taskId: String,
//             parentTaskId: String,
//             step: String,
//             event: String,
//             progress: String,
//             states: String,
//             missionCritical: String,
//             weight: String,
//             percent: String,
//             responsiblePerson: String,
//             timeLimit: String,
//             plannedStartTime: String,
//             plannedEndTime: String,
//             actualStartTime: String,
//             actualEndTime: String,
//             deliverable: String,
//             problemDetail: String
//         });
//         db.sync(function (err) {
//             if (err) throw err;
//
//         });
//         next();
//     }
// }));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


app.post('/file-upload', function (req, res, next) {
    console.log(req.body);
    console.log(req.files);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
