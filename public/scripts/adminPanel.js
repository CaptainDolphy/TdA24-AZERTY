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

                $.ajax({
                    type: 'post',
                    data: {data:JSON.stringify([]),download: true},
                    //beforeSend: function (request) {
                        //    request.setRequestHeader("Authorization", 'Basic VGRBOmQ4RWY2IWRHR19wdg==');
                        //},
                    url: `http://${location.host}/api/booking/${uuid}`,
                    success: function (data) {
                        console.log(data)
                        function download(file, data) {

                            //creating an invisible element

                            var element = document.createElement('a');
                            element.setAttribute('href',
                                'data:text/plain;charset=utf-8, '
                                + encodeURIComponent(data));
                            element.setAttribute('download', file);
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                        }
                        var  filename=`schedule-${uuid}.ics`
                        download(filename, data)
                        //location.assign(data.redirect || '/')
                    },
                    error: function (data) {
                        console.log(data.responseJSON)
                    }

                });


            })

            }
        });
    });
