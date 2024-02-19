var express = require('express');
var router = express.Router();
var path = require('path');
var app = require("../app");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const sqlite3 = require('sqlite3').verbose();

var authController = require(path.join(__dirname, '../controllers', 'auth'));

router.get('/signup', authController.signup_get);
router.get('/login', authController.login_get);
router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);


router.get("/users", authController.users_get);

module.exports = router
