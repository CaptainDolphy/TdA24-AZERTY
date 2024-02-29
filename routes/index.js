var express = require('express');
var router = express.Router();
var path = require('path');
var app = require("../app");
const { requireAuth } = require("../middleware/authMiddleware.js")

var { v4: uuid } = require('uuid');
const { indexBookingUuid_get } = require('../controllers/index.js');

const sqlite3 = require('sqlite3').verbose();


var indexController = require(path.join(__dirname, '../controllers', 'index'));

router.get('/', indexController.index_get);

router.get('/login',                                indexController.login_get);
router.get('/booking/:uuid',                        indexController.bookingUuid_get)
router.get('/lecturer/:uuid',                       indexController.lecturerUuid_get);
router.get('/lecturer/:uuid/adminPanel', requireAuth(), indexController.adminPanel_get);

module.exports = router;
