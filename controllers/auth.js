var app = require("../app");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
var { v4: uuid } = require('uuid');
const handlers = require('../middleware/handlers.js')


const getDbData = async (sql) => {
    return new Promise((resolve, reject) => {
        app.db.all(sql, [], (err, users) => {
            if (err) {
                reject(err);
            }
            resolve(users);
        });
    });
}

const loginUser = async (username, password) => {

    sql = `SELECT * FROM lecturers WHERE username LIKE '${username}'`

    const users = await getDbData(sql)
    if (users[0]) {

        const auth = await bcrypt.compare(password, users[0].password)
        if (auth) {
            return users[0];
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect username');
    }


module.exports.login_get = (req, res) => {
    res.render('login')
}


module.exports.login_post= async (req, res) => {

    const { username, password } = req.body;

    try {
        const user = await loginUser(username, password);
        const token = handlers.createToken(user.uuid);
        res.cookie('jwt', token, { httpOnly: true, maxAge: handlers.tokenMaxAge * 1000})
        const preUrl = req.cookies["context"];
        res.clearCookie("context", { httpOnly: true })

        console.log(preUrl)
        res.status(201).json({ redirect: preUrl });
    } catch (err) {
        const errors = handlers.handleErrors(err)
        res.status(400).json({ errors });
    }



}

