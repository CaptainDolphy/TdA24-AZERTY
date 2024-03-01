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
                    center: '',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
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
                unselectCancel: '.fc-addEventButton-button, #form',
                select: function(info) {
                    selected = info;
                },
                unselect: function(info) {
                    selected = null;
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
