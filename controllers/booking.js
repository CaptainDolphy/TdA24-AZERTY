var app = require("../app");
var path = require('path');

var { v4: uuid } = require('uuid');
const handlers = require('../middleware/handlers.js');

module.exports.booking_get = async (req, res) => {
    var URLuuid = req.params.uuid;
    console.log(URLuuid)
    sql = `SELECT * FROM calendars WHERE uuid=?`;

    app.db.all(sql, [URLuuid], (err, calendar) => {
        if (err || calendar == "") {
            if (err) console.error(err);
            res.status(404);
            res.json({
                "code": 404,
                "message": "User not found"
            });
        }
        else {
            calendar = calendar[0];

            calendarData = JSON.parse(calendar.data);
            res.status(200).json(calendarData);
        }
    });
}


module.exports.booking_post = async (req, res) => {
    var URLuuid = req.params.uuid;

    var calendar = JSON.parse(req.body.data);
    console.log(calendar)

    sql = `SELECT * FROM calendars WHERE uuid=?`;

    app.db.all(sql, [URLuuid], (err, serverCalendar) => {
        if (err || serverCalendar == "") {
            if (err) console.error(err);
            else if (serverCalendar == "") {
                sqlInsert = `INSERT INTO calendars(
                    [uuid],
                    [data]
                ) VALUES (
                    ?,?
                )`;

                app.db.run(sqlInsert, [URLuuid, JSON.stringify(calendar)], (err) => {
                    if (err) {
                        const errors = handlers.handleErrorsApi(err);
                        res.status(400).json({
                            "code": 400,
                            "message": errors
                        });
                    }
                    else {
                        console.log(`Successfully created calendar with uuid: ${URLuuid}`);
                        res.status(200).json(calendar);
                    }
                });
            }
        }
        else {
            serverCalendar = JSON.parse(serverCalendar[0].data);
            //remove overlapping lessons (mistake or trolling in request)
            for (const serverLesson of serverCalendar) {
                for (index in calendar) {
                    console.log(index)
                    if (calendar[index].start == "" || calendar[index].end == "") {
                        calendar.splice(index, 1);
                        break;
                    }
                    calendar[index].start = new Date(calendar[index].start)
                    calendar[index].end = new Date(calendar[index].end)

                    serverLesson.start = new Date(serverLesson.start)
                    serverLesson.end = new Date(serverLesson.end)

                    if (calendar[index].start.getDate() == serverLesson.start.getDate() && calendar[index].start.getMonth() == serverLesson.start.getMonth() && calendar[index].start.getYear() == serverLesson.start.getYear()) {
                        if (calendar[index].start < serverLesson.end && serverLesson.start < calendar[index].end) {
                            calendar.splice(index, 1);
                            break;
                        }
                    }
                }
            }
            const insertCalendar = JSON.stringify([...serverCalendar, ...calendar]);

            sql = `UPDATE calendars SET
                data=?
                WHERE uuid=?`;

            app.db.run(sql, [insertCalendar, URLuuid], (err) => {
                if (err) {
                    res.status(404).json({
                        "code": 404,
                        "message": "Update failed"
                    });
                }
                else {
                    console.log(`Successfully updated calendar with uuid: ${URLuuid}`);

                    res.status(200).json(calendar);
                }
            });
        }
    });
}
