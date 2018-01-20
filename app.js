var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io')();
var config = require(__dirname + '/config.js');
var db = require('rethinkdb');

// Routes
var index = require('./routes/index');
var debit = require('./routes/debit');
var consommation = require('./routes/consommation');

// Socket.io
var app = express();
app.io = io;

db.connect(config.rethinkdb)
  .then(conn => db.table('debit').orderBy({index: 'id'}).changes().run(conn, function(err, cursor){
    cursor.each((err, row) => {
      if (err) throw err;
      console.log(row);
      if(row.new_val != null)
        io.emit('debit', row.new_val);
    });
  }));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/debit', debit);
app.use('/consommation', consommation);

io.on('connection', function(socket) {
  console.log('a user connected');
});


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
