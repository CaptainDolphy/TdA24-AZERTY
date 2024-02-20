$(document).ready(function () {

    $.getJSON(`http://${location.host}/api/lecturers`).done(function (data) {


        $("#showpass").on("click", function () {
            var passField = document.getElementById("password")
            passField.type = passField.type === "password" ? "text" : "password";
        });

        $("#bttn").on("click",  function () {
            $("#username-error").text("")
            $("#password-error").text("")


            $.post(`http://${location.host}/api/auth/login`,
                {
                    username: `${$("#username").val()}`,
                    password: `${$("#password").val()}`,
                },
                function(data) {
                    console.log(data)
                    location.assign(data.redirect || '/')
                })
                .fail(function(data) {
                  console.log(data.responseJSON)

                    $("#username-error").text(data.responseJSON.errors.username)
                    $("#password-error").text(data.responseJSON.errors.password)


                });


        });


    });
});
