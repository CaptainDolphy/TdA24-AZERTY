var express = require('express');
var router = express.Router();
var path = require('path');
var app = require("../app");


module.exports.index_get = (req, res, next) => {
      res.render('homepage', { title: 'Katalog' });
}
module.exports.login_get = (req, res, next) => {
    res.render('login', { title: 'Login' });
}
module.exports.bookingUuid_get = (req, res, next) => {
    var URLuuid = req.params.uuid;
    res.render('booking', { title: 'Booking', uuid:URLuuid })
}
module.exports.lecturerUuid_get = async (req, res, next) => {
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
            res.render('lecturer', { title: 'Lektoři', uuid:URLuuid });
        }
        else {
            res.status(404);
            res.render('lecturer-error', { title: 'Express' });
        }
    });


}
module.exports.adminPanel_get = (req, res, next) => {
    var URLuuid = req.params.uuid;
    res.render('adminPanel', { title: 'Admin Panel', uuid:URLuuid })
}
