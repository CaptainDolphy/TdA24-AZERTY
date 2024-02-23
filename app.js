var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { open } = require('sqlite')

// setting the sqlite to verbose debugging mode (https://github.com/TryGhost/node-sqlite3/wiki/Debugging)
const sqlite3 = require('sqlite3').verbose();
// creates database with fileneme db.sqlite in directory './data/'
const fs = require("node:fs");
if(!fs.existsSync(path.join(__dirname, 'data'))){
  // create data directory if it does not exist
  fs.mkdirSync(path.join(__dirname, 'data'));
}

(async () => {
    // open the database
    const db = await open({
      filename: path.join(__dirname, 'data','db.sqlite'),
      driver: sqlite3.Database
    });

    await db.run(sqlLecturerTable);
})()
const db = new sqlite3.Database(path.join(__dirname, 'data','db.sqlite'));

var lecturersRouter = require(path.join(__dirname, 'routes', 'lecturers'));
var indexRouter = require(path.join(__dirname, 'routes', 'index'));
var authRouter = require(path.join(__dirname, 'routes', 'auth'));

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//api
app.use('/api/lecturers', lecturersRouter);

//auth

app.use('/api/auth', authRouter);

//frontend
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var sqlLecturerTable = `CREATE TABLE IF NOT EXISTS lecturers(
    [uuid] TEXT,
    [title_before] TEXT,
    [first_name] TEXT NOT NULL CHECK(first_name <> ''),
    [middle_name] TEXT,
    [last_name] TEXT NOT NULL CHECK(last_name <> ''),
    [title_after] TEXT,
    [picture_url] TEXT,
    [location] TEXT,
    [claim] TEXT,
    [bio] TEXT,
    [tags] BLOB,
    [price_per_hour] INT,
    [contact] BLOB,
    [lecturer_username] TEXT NOT NULL UNIQUE CHECK(lecturer_username <> ''),
    [lecturer_password] TEXT NOT NULL CHECK(lecturer_password <> '') CHECK(length(lecturer_password) > 6)
)`;

//var sqlUserTable = `CREATE TABLE IF NOT EXISTS users(
  //  [uuid] TEXT NOT NULL CHECK(uuid <> ''),
  //  [username] TEXT NOT NULL UNIQUE CHECK(username <> ''),
  //  [password] TEXT NOT NULL CHECK(password <> '') CHECK(length(password) > 6)
//)`


module.exports = app;
exports.db = db;
