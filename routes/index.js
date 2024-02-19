var express = require('express');
var router = express.Router();
var path = require('path');
var app = require("../app");

var { v4: uuid } = require('uuid');

const sqlite3 = require('sqlite3').verbose();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage', { title: 'Katalog' });
});

/* GET signup page.  */
router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'Sign up' });
});
/* GET login page.  */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' });
});

/* GET home page of each lecturer . */
router.get('/lecturer/:uuid', async function(req, res, next) {
  var URLuuid = req.params.uuid;

  sql = `SELECT * FROM lecturers`;

  var lecturer;

  var lecturerFound = false;

  app.db.all(sql, [], (err, rows) => {

    rows.forEach(row => {
      if (row.uuid == URLuuid) {

        lecturer = row;

        lecturer.tags = JSON.parse(lecturer.tags);
        lecturer.contact = JSON.parse(lecturer.contact);

        lecturerFound = true;
      }
    });
    if (lecturerFound) {
      res.status(200);
      res.render('lecturer', { title: 'Lektori', uuid:URLuuid });
    }
    else {
      res.status(404);
      res.render('lecturer-error', { title: 'Express' });
    }
  });


});

module.exports = router;
