
$(document).ready(function () {


    $.ajax({
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", 'Basic VGRBOmQ4RWY2IWRHR19wdg==');
        },
        dataType: "json",
        url: `http://${location.host}/api/lecturers/${uuid}`,
        success: function (data) {

            var selected=null;
            var calendarEl = document.getElementById('calendar');
            var calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'timeGridWeek',
                headerToolbar: {
                    left: 'prev,next,today',
                    center: 'addEventButton',
                    right: 'timeGridWeek,timeGridDay'
                },
                selectable: true,
                selectOverlap: false,
                selectConstraint: 'businessHours',
                businessHours: {
                    daysOfWeek: [0,1,2,3,4,5,6],
                    startTime: '8:00',
                    endTime: '20:00',
                },
                slotDuration: '01:00',

                select: function(info) {
                    selected = info;
                },

                customButtons: {
                    addEventButton: {
                        text: 'add event...',
                        click: function() {
                            if (selected!= null) {
                                document.getElementById("form").style.display = "block";
                            }
                            $("#bttn.submit").on("click", function () {


                                if (!isNaN(selected.start.valueOf())) { // valid?
                                        calendar.addEvent({
                                            title: `Schuzka s: ${$('#fname').val()} ${$('#lname').val()} `,
                                            start: selected.start,
                                            end: selected.end,
                                            allDay: false
                                        });
                                    alert('Great. Now, update your database...');
                                    selected=null;
                                    var jsonData = calendar.getEvents().map(function(event) {
                                        return {
                                            title: event.title,
                                            start: event.start,
                                            end: event.end
                                        };
                                    });

                                    console.log(jsonData);
                                    $.ajax({
                                        type: 'post',
                                        data: jsonData,
                                        beforeSend: function (request) {
                                            request.setRequestHeader("Authorization", 'Basic VGRBOmQ4RWY2IWRHR19wdg==');
                                        },
                                        dataType: "json",
                                        url: `http://${location.host}/api/lecturers/${uuid}`,
                                        success: function (data) {
                                            console.log(data)
                                            location.assign(data.redirect || '/')
                                        },
                                        error: function (data) {
                                            console.log(data.responseJSON)
                                        }

                                    });
                                } else {
                                    alert('Invalid date.');
                                }
                            })
                        }
                    }
                },
                events:
                {
                    url: `http://${location.host}/api/lecturers/${uuid}`,
                    format: 'ical',
                    method: 'GET',
                    extraParams:{},
                }

                });
            calendar.render();

            var calendarjQ = $(calendarEl);

            $("#bttn").on("click", function () {

                $.post(`http://${location.host}/api/lecturers/${data.uuid}`,
                    {
                        uuid: `${data.uuid}`,
                        schedule: `${$(":file")[0].files[0]}`
                    },
                    function (res) {
                        console.log(res)
                    })
                    .fail(function (res) {
                        console.log(res.responseJSON)
                    })


                console.log($(":file")[0].files[0]);
            })

            }
        });
    });
