
$(document).ready(function () {

    $.getJSON(`http://${location.host}/api/lecturers/${uuid}`).done(function (data) {
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                center: 'addEventButton'
            },
            customButtons: {
                addEventButton: {
                    text: 'add event...',
                    click: function() {

                        document.getElementById("form").style.display = "block";

                        if (!isNaN(date.valueOf())) { // valid?
                                calendar.addEvent({
                                    title: 'dynamic event',
                                    start: date,
                                    allDay: true
                                });
                            alert('Great. Now, update your database...');
                        } else {
                            alert('Invalid date.');
                        }
                    }
                }
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
            function(res) {
               console.log(res)
            })
            .fail(function(res) {
                console.log(res.responseJSON)
            })


        console.log($(":file")[0].files[0]);
    })

    });
});
