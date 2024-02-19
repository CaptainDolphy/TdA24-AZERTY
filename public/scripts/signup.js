$(document).ready(function () {

    $.getJSON(`http://${location.host}/api/lecturers`).done(function (data) {


        $("#showpass").on("click", function () {
            var passField = document.getElementById("password")
            passField.type = passField.type === "password" ? "text" : "password";
        });

        $("#bttn").on("click",  function () {



            $.post(`http://${location.host}/api/auth/signup`,
                {
                    username: `${$("#username").val()}`,
                    password: `${$("#password").val()}`,
                },
                function(data) {
                    console.log(data)
                    if (data.user) {
                        location.assign('/');
                    }
                })
                .fail(function(data) {
                    console.log(data.responseJSON)

                    $("#username-error").text(data.responseJSON.errors.username)
                    $("#password-error").text(data.responseJSON.errors.password)


                });


        });


    });
});
