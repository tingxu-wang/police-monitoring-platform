var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var app = express();

//routes
var router=require('./routes/index')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('.html',require('ejs').__express)//加载html渲染模块

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
/*app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));*/
app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));
app.use(cookieParser());
app.use('/',express.static(path.join(__dirname,'views')))
app.use('/dev',express.static(path.join(__dirname,'dev')))//开发用静态页目录
app.use('/src',express.static(path.join(__dirname,'src')));//工程目录
app.use('/static',express.static(path.join(__dirname,'static')));//静态资源
app.use('/lib',express.static(path.join(__dirname,'lib')))//第三方静态资源
//app.use('/demo',express.static(path.join(__dirname,'views','demo')))//demo页位置

router(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
