var app = require("../app");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
var { v4: uuid } = require('uuid');



const handleErrorsApi = (err) => {
    console.log(err)
    let errors = "";

    if (err.message.includes("UNIQUE constraint failed: lecturers.lecturer_username")) {
        errors = 'This username already exists. Please use another one';
    }
    else if (err.message.includes("lecturer_username <> ''")) {
        errors = 'The username is missing.';
    }
    else if (err.message.includes("length(lecturer_password) > 6")) {
        errors = 'Minimum password length it 6 characters';
    }
    else if (err.message.includes("lecturer_password <> ''")) {
        errors = 'The password is missing.';
    }


    return errors;
}

const handleErrorsFrontEnd = (err) => {
    console.log(err)
    let errors = {
        lecturer_username: "",
        lecturer_password: ""
    };

    // Incorrect username or password
    if (err.message === 'Incorrect username' || err.message === 'Incorrect password') {
        errors.lecturer_password = 'Incorrect username or password';
    }
    else if (err.message === 'Enter username') {
        errors.lecturer_username = 'Please enter a username';
    }
    else if (err.message === 'Enter password') {
        errors.lecturer_password = 'Please enter a password';
    }


    return errors;
}

const tokenMaxAge = 15 * 60; // 15minutes
const createToken = (uuid) => {
    return jwt.sign({ uuid }, 'f6264014d8c8b3d7923de0087777bc38', {
        expiresIn: tokenMaxAge
    });
}

module.exports = { handleErrorsApi, handleErrorsFrontEnd, createToken, tokenMaxAge }
