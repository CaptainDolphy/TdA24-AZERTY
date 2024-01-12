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
    res.json(rows);
    res.status(200);
  }); 

});

module.exports = router;