
$(document).ready(function () {
    $.ajaxSetup({
        headers: { 'Authorization': 'Basic VGRBOmQ4RWY2IWRHR19wdg==' }
    });

    $.ajax({
        dataType: "json",
        url: `http://${location.host}/api/booking/${uuid}`,
        success: function (data) {

            var selected = null;
            var calendarEl = document.getElementById('calendar');
            var calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'timeGridWeek',
                headerToolbar: {
                    left: 'prev,next,today',
                    right: 'timeGridWeek,timeGridDay'
                },
                selectable: true,
                selectOverlap: false,
                selectConstraint: 'businessHours',
                businessHours: {
                    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                    startTime: '8:00',
                    endTime: '20:00',
                },
                slotDuration: '01:00',
                unselectCancel: '.fc-addEventButton-button, #form, .submit',
                select: function (info) {
                    selected = info;
                    if (selected != null) {
                        document.getElementById("form").style.display = "block";
                    }
                    $("#bttn.submit").on("click", function () {

                        console.log(selected)
                        if (!isNaN(selected.start.valueOf())) { // valid?
                            document.getElementById("fname").style.color = "#000000"
                            document.getElementById("lname").style.color = "#000000"
                            document.getElementById("email").style.color = "#000000"
                            if (!$('#fname').val()) {
                                document.getElementById("fname").style.color = "#ff3030"
                            }
                            else if (!$('#lname').val()) {
                                document.getElementById("lname").style.color = "#ff3030"
                            }
                            else if (!$('#email').val() && !$('#number').val()) {
                                document.getElementById("email").style.color = "#ff3030"
                            }
                            else {
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
                                }, 1);
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
                                    data: { data: JSON.stringify(jsonData) },
                                    dataType: "json",
                                    url: `http://${location.host}/api/booking/${uuid}`,
                                    success: function (data) {
                                        console.log(data);
                                        document.getElementById("form").style.display = "none";
                                        //location.assign(data.redirect || '/')
                                    },
                                    error: function (data) {
                                        console.log(data.responseJSON)
                                    }

                                });
                            }
                        } else {
                            alert('Invalid date.');
                        }
                    });
                },
                unselect: function (info) {
                    selected = null;
                    document.getElementById("form").style.display = "none";
                },
                eventSources:
                [{
                    id: 1,
                    url: `http://${location.host}/api/booking/${uuid}`,
                    method: 'GET',
                    endParam: '',
                    startParam: '',
                }]

            });
            calendar.render();

            var calendarjQ = $(calendarEl);



        }
    });
});
