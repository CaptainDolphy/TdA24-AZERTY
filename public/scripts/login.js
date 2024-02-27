$(document).ready(function () {

    $.ajax({
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", 'Basic VGRBOmQ4RWY2IWRHR19wdg==');
        },
        dataType: "json",
        url: `http://${location.host}/api/lecturers`,
        success: function (data) {


            $("#showpass").on("click", function () {
                var passField = document.getElementById("password")
                passField.type = passField.type === "password" ? "text" : "password";
            });

            $("#bttn").on("click", function () {
                $("#username-error").text("")
                $("#password-error").text("")


                $.post(`http://${location.host}/api/auth/login`,
                    {
                        lecturer_username: `${$("#username").val()}`,
                        lecturer_password: `${$("#password").val()}`,
                    },
                    function (data) {
                        console.log(data)
                        location.assign(data.redirect || '/')
                    })
                    .fail(function (data) {
                        console.log(data.responseJSON)

                        $("#username-error").text(data.responseJSON.errors.lecturer_username || "")
                        $("#password-error").text(data.responseJSON.errors.lecturer_password || "")


                    });


            });


        }
    });
});
