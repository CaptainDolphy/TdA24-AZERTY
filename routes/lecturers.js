var express = require('express');
var router = express.Router();
var path = require('path');
var app = require("../app");

var { v4: uuid } = require('uuid');

const sqlite3 = require('sqlite3').verbose();

router.post('/', async function (req, res) {
  var lecturer = req.body;

  var status = 200;

  //check if lecturer has all necessary data
  if ("first_name" in lecturer && "last_name" in lecturer && lecturer.first_name != "" && lecturer.first_name != null && lecturer.last_name != "" && lecturer.last_name != null) {
    lecturer.uuid = uuid();

    lecturer.tags.forEach(tag => {
      tag.uuid = uuid();
    });

    sqlInsert = `INSERT INTO lecturers(
    [uuid],
    [title_before],
    [first_name],
    [middle_name],
    [last_name],
    [title_after],
    [picture_url],
    [location],
    [claim],
    [bio],
    [tags],
    [price_per_hour],
    [contact]
  ) VALUES (
    ?,?,?,?,?,?,?,?,?,?,?,?,?
  )`;

    await app.db.run(sqlInsert, [
      lecturer.uuid,
      lecturer.title_before,
      lecturer.first_name,
      lecturer.middle_name,
      lecturer.last_name,
      lecturer.title_after,
      lecturer.picture_url,
      lecturer.location,
      lecturer.claim,
      lecturer.bio,
      JSON.stringify(lecturer.tags),
      lecturer.price_per_hour,
      JSON.stringify(lecturer.contact)
    ], (err) => {
      if (err) console.error(err)
      else console.log(`Successfully added lecturer ${lecturer.first_name} ${lecturer.last_name} with uuid: ${lecturer.uuid}`);
    })

    res.json(lecturer);
    res.status(200);
  }
  else {
    res.status(400);
    res.json(lecturer);
  }
});

router.get('/', async function (req, res) {

  sql = `SELECT * FROM lecturers`;

  app.db.all(sql, [], (err, rows) => {

    rows.forEach(row => {
      row.tags = JSON.parse(row.tags);
      row.contact = JSON.parse(row.contact);
    });

    res.json(rows);
    res.status(200);
  }); 

});

router.get('/:uuid', async function (req, res) {
  var URLuuid = req.params.uuid;

  sql = `SELECT * FROM lecturers`;

  var lecturer;

  var lecturerFound = false;

  app.db.all(sql, [], (err, rows) => {

    rows.forEach(row => {
      if(row.uuid == URLuuid) {
        lecturer = row;

        lecturer.tags = JSON.parse(lecturer.tags);
        lecturer.contact = JSON.parse(lecturer.contact);

        lecturerFound = true;
      } 
    }); 
    if(lecturerFound) {
      res.status(200);
      res.json(lecturer);
    }
    else {
      res.status(404);
      res.json({
        "code": 404,
        "message": "User not found"
      });
    }
  }); 
});

module.exports = router;