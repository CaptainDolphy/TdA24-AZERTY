var app = require("../app");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
var { v4: uuid } = require('uuid');

// Handle errors
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

const maxAge = 15 * 60; // 15minutes
const createToken = (uuid) => {
    return jwt.sign({ uuid }, 'lofsrfl', {
        expiresIn: maxAge
    });
}

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

    sql = `SELECT * FROM users WHERE username LIKE '${username}'`

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


module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.login_get = (req, res) => {
    res.render('signup')
}

module.exports.signup_post= async (req, res) => {
    const user = req.body;

    user.uuid = uuid();
    if (user.password != null && user.password != '' && user.password.length >= 6) {
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
    }


    sqlInsert = `INSERT INTO users(
        [uuid],
        [username],
        [password]
    ) VALUES (
        ?,?,?
    )`;

    await app.db.run(sqlInsert, [
        user.uuid,
        user.username,
        user.password
    ], (err) => {
        if (err) {
            const errors = handleErrors(err);
            res.status(400).json({ errors })
        } else {

            console.log(`Successfully added a new user ${user.username}`)
            const token = createToken(user.uuid);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
            res.status(201).json({ user: user.uuid });
        }
    });


}

module.exports.login_post= async (req, res) => {

    const { username, password } = req.body;

    try {
        const user = await loginUser(username, password);
        const token = createToken(user.uuid);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
        res.status(200).json({uuid:user.uuid});
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors });
    }



}

module.exports.users_get= async (req, res) => {

    sql = `SELECT * FROM users`;

    app.db.all(sql, [], (err, rows) => {


        res.json(rows);
        res.status(200);
    });
}
