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
            for (let j = 0; j < serverCalendar.length; j++) {
                for (let i = 0; i < calendar.length; i++) {
                    console.log(i)
                    if (calendar[i].start == "" || calendar[i].end == "") {
                        calendar.splice(i, 1);
                    }
                    calendar[i].start = new Date(calendar[i].start)
                    calendar[i].end = new Date(calendar[i].end)

                    serverCalendar[j].start = new Date(serverCalendar[j].start)
                    serverCalendar[j].end = new Date(serverCalendar[j].end)

                    if (calendar[i].start.getDate() == serverCalendar[j].start.getDate() && calendar[i].start.getMonth() == serverCalendar[j].start.getMonth() && calendar[i].start.getYear() == serverCalendar[j].start.getYear()) {
                        if (calendar[i].start < serverCalendar[j].end && serverCalendar[j].start < calendar[i].end) {
                            calendar.splice(i, 1);
                        }
                    }
                }
            }


            if (req.body.download) {

                var ics = "BEGIN:VCALENDAR\n";
                ics += "PRODID:-//TdA//Meeting\n"
                ics += "VERSION:2.0\n"
                for (const serverLesson of serverCalendar){

                    function getDate(date) {

                            var pre =
                                date.getFullYear().toString() +
                                ((date.getMonth() + 1)<10? "0" + (date.getMonth() + 1).toString():(date.getMonth() + 1).toString()) +
                                ((date.getDate() + 1)<10? "0" + date.getDate().toString():date.getDate().toString());

                            var post = ((date.getHours()<10?'0':'')+ date.getHours()) + ((date.getMinutes()<10?'0':'')+ date.getMinutes()) + "00";

                            return pre + "T" + post;
                    }
                ics += "BEGIN:VEVENT\n"
                ics += `UID:${URLuuid}--${serverCalendar.indexOf(serverLesson)}\n`
                    ics += `ORGANIZER:MAil lecturera?\n`
                    ics += `DTSTAMP:${getDate(new Date())}\n`
                    ics += `DTSTART:${getDate(new Date(serverLesson.start))}\n`
                    ics += `DTEND:${getDate(new Date(serverLesson.end))}\n`
                    ics += "STATUS:CONFIRMED\n"
                    ics += `CATEGORIES:${serverLesson.extendedProps.reltags}\n`
                    ics += `SUMMARY:${serverLesson.title}\n`
                    ics += `DESCRIPTION:Message: ${serverLesson.extendedProps.message}, Email:${serverLesson.extendedProps.mail}, Number:${serverLesson.extendedProps.number}\n`
                    ics += "END:VEVENT\n"
                }
                ics += "END:VCALENDAR\n";

                res.status(200).send(`${ics}`)
                return
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
