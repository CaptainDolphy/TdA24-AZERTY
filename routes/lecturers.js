var express = require('express');
var router = express.Router();
var path = require('path');
var app = require("../app");

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken')
var { v4: uuid } = require('uuid');
var handlers = require('../middleware/handlers.js')

const sqlite3 = require('sqlite3').verbose();

var lecturerController = require(path.join(__dirname, '../controllers', 'lecturer'));


router.post('/', lecturerController.lecturer_post);
router.get('/', lecturerController.lecturer_get);

router.get('/:uuid', lecturerController.lecturerUuid_get);
router.delete('/:uuid', lecturerController.lecturerUuid_delete);
router.put('/:uuid', lecturerController.lecturerUuid_put);

module.exports = router;
