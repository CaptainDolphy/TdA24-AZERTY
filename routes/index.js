var express = require('express');
var router = express.Router();
var path = require('path');
var app = require("../app");

var { v4: uuid } = require('uuid');

const sqlite3 = require('sqlite3').verbose();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'TeacherDigitalAgency' });
});

/* GET lecturer catalog page. */
router.get('/katalog', async function(req, res, next) {
    res.render('catalog', { title: 'KatalogLektoru' });
});

/* GET lecturer booking page. */
router.get('/booking/:uuid', async function(req, res, next) {
    res.render('booking', { title: 'RezervaceLektoru' });
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
