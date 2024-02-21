var app = require("../app");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
var { v4: uuid } = require('uuid');
const handlers = require('../middleware/handlers.js')


module.exports.lecturer_post = async (req, res) => {
    var lecturer = req.body;

    //check if lecturer has all necessary data
    lecturer.uuid = uuid();

    var LTags = [];
    var UsedNames = [];
    if(Array.isArray(lecturer.tags)) {
        lecturer.tags.forEach(tag => {
            if(tag.name) {
                if(!UsedNames.includes(tag.name)) {
                    tag.uuid = uuid();
                    LTags.push(tag);
                    UsedNames.push(tag.name);
                }
            }
        });

        lecturer.tags = LTags;
    }
    else {
        delete lecturer.tags;
    }

    for(var property in lecturer) {
        if(property != "tags" && property != "price_per_hour" && property != "contact") {
            if(typeof lecturer[property] !== 'string') {
                lecturer[property] = null;
            }
        }
    };

    if (lecturer.password != null && lecturer.password != '' && lecturer.password.length >= 6) {
        const salt = await bcrypt.genSalt();
        lecturer.password = await bcrypt.hash(lecturer.password, salt);
    }


    sqlInsert = `INSERT INTO lecturers(
        [uuid],
        [title_before],
        [first_name],
        [middle_name],
        [last_name],
        [title_after],
        [picture_url],
        [location],
        [claim],
        [bio],
        [tags],
        [price_per_hour],
        [contact],
        [username],
        [password]
    ) VALUES (
        ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
    )`;

    await app.db.run(sqlInsert, [
        lecturer.uuid,
        lecturer.title_before,
        lecturer.first_name,
        lecturer.middle_name,
        lecturer.last_name,
        lecturer.title_after,
        lecturer.picture_url,
        lecturer.location,
        lecturer.claim,
        lecturer.bio,
        JSON.stringify(lecturer.tags),
        lecturer.price_per_hour,
        JSON.stringify(lecturer.contact),
        lecturer.username,
        lecturer.password
    ], (err) => {
        if (err) {
            const errors = handlers.handleErrors(err);
            res.status(400).json({ errors: errors })
        } else {
            console.log(`Successfully added lecturer ${lecturer.first_name} ${lecturer.last_name} with uuid: ${lecturer.uuid}`);
            const token = handlers.createToken(lecturer.uuid);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
            res.status(201).json({ lecturer: lecturer.uuid });
        }
    });
}


module.exports.lecturer_get = async (req, res) => {

    sql = `SELECT * FROM lecturers`;

    app.db.all(sql, [], (err, rows) => {

        rows.forEach(row => {
            row.tags = JSON.parse(row.tags);
            row.contact = JSON.parse(row.contact);
        });

        res.json(rows);
        res.status(200);
  });

}

module.exports.lecturerUuid_get = async (req, res) => {
    var URLuuid = req.params.uuid;

    sql = `SELECT * FROM lecturers`;

    var lecturer;

    var lecturerFound = false;

    app.db.all(sql, [], (err, rows) => {

        rows.forEach(row => {
            if (row.uuid == URLuuid) {

                lecturer = row;

                lecturer.tags = JSON.parse(lecturer.tags);
                lecturer.contact = JSON.parse(lecturer.contact);

                lecturerFound = true;
            }
        });
        if (lecturerFound) {
            res.status(200);
            res.json(lecturer);
        }
        else {
            res.status(404);
            res.json({
                "code": 404,
                "message": "User not found"
            });
        }
    });

}


module.exports.lecturerUuid_delete= async (req, res) => {
    var URLuuid = req.params.uuid;

    sql = `SELECT * FROM lecturers WHERE uuid=?`;

    app.db.all(sql, [URLuuid], (err, lecturer) => {
        if (err || lecturer == "") {
            if (err) console.error(err);
            res.status(404);
            res.json({
                "code": 404,
                "message": "User not found"
            });
        }
        else {
            sql = `DELETE FROM lecturers WHERE uuid=?`;

            app.db.run(sql, [URLuuid], (err) => {
                if (err) {
                    console.error(err)
                }
                else {
                    res.status(204);
                    res.json({});
                    console.log(`Successfully deleted lecturer with uuid: ${URLuuid}`)
                }
            });
        }
    });
}

module.exports.lecturerUuid_put = async (req, res) => {
    var URLuuid = req.params.uuid;

    sql = `SELECT * FROM lecturers WHERE uuid=?`;

    app.db.all(sql, [URLuuid], (err, lecturer) => {
        if (err || lecturer == "") {
            if (err) console.error(err);
            res.status(404);
            res.json({
                "code": 404,
                "message": "User not found"
            });
        }
        else {
            lecturer = lecturer[0];
            for (const key in req.body) {
                if (key != "uuid" || key in lecturer || key != "tags") {
                    lecturer[key] = req.body[key];
                }
                if (key == "tags") {
                    lecturer.tags = req.body.tags;
                    lecturer.tags.forEach(tag => {
                        tag.uuid = uuid();
                    });
                }
            }

            sql = `DELETE FROM lecturers WHERE uuid=?`;

            app.db.run(sql, [URLuuid], (err) => {
                if (err) console.log(err);
            });

            sqlInsert = `INSERT INTO lecturers(
                [uuid],
                [title_before],
                [first_name],
                [middle_name],
                [last_name],
                [title_after],
                [picture_url],
                [location],
                [claim],
                [bio],
                [tags],
                [price_per_hour],
                [contact],
                [username]
            ) VALUES (
                ?,?,?,?,?,?,?,?,?,?,?,?,?
            )`;

            app.db.run(sqlInsert, [
                lecturer.uuid,
                lecturer.title_before,
                lecturer.first_name,
                lecturer.middle_name,
                lecturer.last_name,
                lecturer.title_after,
                lecturer.picture_url,
                lecturer.location,
                lecturer.claim,
                lecturer.bio,
                JSON.stringify(lecturer.tags),
                lecturer.price_per_hour,
                JSON.stringify(lecturer.contact),
                lecturer.username,
                lecturer.password
            ], (err) => {
                if (err) console.error(err);
                else console.log(`Successfully updated lecturer ${lecturer.first_name} ${lecturer.last_name} with uuid: ${lecturer.uuid}`);
            });

            res.json(lecturer);
            res.status(204);
        }
    });
}

module.exports.lecturerUuid_put = async (req, res) => {
    var URLuuid = req.params.uuid;
}

/*
{
    first_name: "",
    last_name: "",
    e_mail: "",
    number: "",
    relevant_tags: [],
    message: "",
    lessons: []
}


*/
