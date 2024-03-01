
$(document).ready(function () {


    $.ajax({
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", 'Basic VGRBOmQ4RWY2IWRHR19wdg==');
        },
        dataType: "json",
        url: `http://${location.host}/api/booking/${uuid}`,
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
                unselectCancel: '.fc-addEventButton-button, #form, .submit',
                select: function(info) {
                    selected = info;
                },
                unselect: function(info) {
                    selected = null;
                },

                customButtons: {
                    addEventButton: {
                        text: 'add event...',
                        click: function() {
                            if (selected!= null) {
                                document.getElementById("form").style.display = "block";
                            }
                            $("#bttn.submit").on("click", function () {

                            console.log(selected)
                                if (!isNaN(selected.start.valueOf())) { // valid?
                                        calendar.addEvent({
                                            title: `Schuzka s: ${$('#fname').val()} ${$('#lname').val()}`,
                                            start: selected.start,
                                            end: selected.end,
                                            extendedProps: {
                                                email: `${$('#email').val()}`,
                                                number: `${$('#number').val()}`,
                                                reltags: `${$('#reltags').val()}`,
                                                message: `${$('#message').val()}`,
                                            },
                                            allDay: false
                                        });
                                    selected = null;
                                    var events = calendar.getEvents();
                                    var jsonData = [];
                                    events.forEach((event, index) => {
                                        var eventToPush = {
                                            title: event.title,
                                            start: event.start,
                                            end: event.end,
                                            extendedProps: {
                                                email: event.extendedProps.email,
                                                number: event.extendedProps.number,
                                                reltags: event.extendedProps.reltags,
                                                message: event.extendedProps.message,
                                            }
                                        }
                                        jsonData.push(eventToPush);
                                    });

                                    console.log(jsonData);
                                    $.ajax({
                                        type: 'post',
                                        data: {data:JSON.stringify(jsonData)},
                                        //beforeSend: function (request) {
                                        //    request.setRequestHeader("Authorization", 'Basic VGRBOmQ4RWY2IWRHR19wdg==');
                                        //},
                                        dataType: "json",
                                        url: `http://${location.host}/api/booking/${uuid}`,
                                        success: function (data) {
                                            console.log(data)
                                            //location.assign(data.redirect || '/')
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
                    url: `http://${location.host}/api/booking/${uuid}`,
                    method: 'GET',
                    endParam:'',
                    startParam: '',
                }

                });
            calendar.render();

            var calendarjQ = $(calendarEl);

            $("#bttn").on("click", function () {

                $.post(`http://${location.host}/api/lecturers/${data.uuid}`,//tady musi byt k tomu ten auth header na to api
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
