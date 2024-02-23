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

const loginUser = async (lecturer_username, lecturer_password) => {

    sql = `SELECT * FROM lecturers WHERE lecturer_username LIKE '${lecturer_username}'`

    const users = await getDbData(sql)
    const user = users[0]

    if (!lecturer_username) throw Error('Enter username');
    if (!lecturer_password) throw Error('Enter password');

    if (user) {

        const auth = await bcrypt.compare(lecturer_password, user.lecturer_password)
        if (auth) {
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect username');
}


module.exports.login_get = (req, res) => {
    res.render('login')
}


module.exports.login_post = async (req, res) => {

    const { lecturer_username, lecturer_password } = req.body;

    try {
        const user = await loginUser(lecturer_username, lecturer_password);
        const token = handlers.createToken(user.uuid);
        res.cookie('jwt', token, { httpOnly: true, maxAge: handlers.tokenMaxAge * 1000 })
        const preUrl = req.cookies["context"];
        res.clearCookie("context", { httpOnly: true })

        console.log(preUrl)
        res.status(201).json({ redirect: preUrl });
    } catch (err) {
        const errors = handlers.handleErrorsFrontEnd(err)
        res.status(400).json({errors});
    }



}

