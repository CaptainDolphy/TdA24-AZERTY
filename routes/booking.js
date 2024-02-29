var express = require('express');
var router = express.Router();
var path = require('path');
var app = require("../app");

var { v4: uuid } = require('uuid');
var handlers = require('../middleware/handlers.js')

const sqlite3 = require('sqlite3').verbose();

var bookingController = require(path.join(__dirname, '../controllers', 'booking'));

router.post('/:uuid', bookingController.booking_post);
router.get('/:uuid', bookingController.booking_get);

module.exports = router;
