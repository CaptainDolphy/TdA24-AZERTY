var app = require("../app");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
var { v4: uuid } = require('uuid');



const handleErrors = (err) => {
    console.log(err)
    let errors =  { username: '', password: '' };


    // Incorrect username
    if (err.message === 'Incorrect username') {
        errors.username = 'That username is not registered'
    }
    // Incorrect username
    if (err.message === 'Incorrect password') {
        errors.password= 'That password is incorrect'
    }

    if (err.message.includes("UNIQUE constraint failed: users.username")) {
        errors['username'] = 'This username already exists. Please use another one';
    }
    if (err.message.includes("username <> ''")) {
        errors['username'] = 'The username is missing.';
    }
    if (err.message.includes("length(password) > 6")) {
        errors['password'] = 'Minimum password length it 6 characters';
    }
    if (err.message.includes("password <> ''")) {
        errors['password'] = 'The password is missing.';
    }


    return errors;
}

const tokenMaxAge = 15 * 60; // 15minutes
const createToken = (uuid) => {
    return jwt.sign({ uuid }, 'f6264014d8c8b3d7923de0087777bc38', {
        expiresIn: tokenMaxAge
    });
}

module.exports = { handleErrors, createToken, tokenMaxAge }
