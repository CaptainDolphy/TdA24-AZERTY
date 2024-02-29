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

router.use(authentication);

router.post('/', lecturerController.lecturer_post);
router.get('/', lecturerController.lecturer_get);

router.get('/:uuid', lecturerController.lecturerUuid_get);
router.delete('/:uuid', lecturerController.lecturerUuid_delete);
router.put('/:uuid', lecturerController.lecturerUuid_put);

function authentication(req, res, next) {
    const authheader = req.headers.authorization;

    if (!authheader) {
        let err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err)
    }

    const auth = new Buffer.from(authheader.split(' ')[1],
        'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];

    if (user == 'TdA' && pass == 'd8Ef6!dGG_pv') {

        // If Authorized user
        next();
    } else {
        let err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
    }

}

module.exports = router;
