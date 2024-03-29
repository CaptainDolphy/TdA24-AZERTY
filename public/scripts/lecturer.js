$(document).ready(function () {
    $.ajax({
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", 'Basic VGRBOmQ4RWY2IWRHR19wdg==');
        },
        dataType: "json",
        url: `http://${location.host}/api/lecturers/${uuid}`,
        success: function (data) {
            data.title_before = (data.title_before == null) ? "" : data.title_before
            data.middle_name = (data.middle_name == null) ? "" : data.middle_name
            data.title_after = (data.title_after == null) ? "" : data.title_after
            data.location = (data.location == null) ? "Location unspecified" : data.location
            data.claim = (data.claim == null) ? "" : data.claim
            data.price_per_hour = (data.price_per_hour == null) ? "Unspecified" : data.price_per_hour
            data.bio = (data.bio == null) ? "Bio unspecified..." : data.bio
            data.contact = (data.contact == null) ? {} : data.contact
            data.tags = (data.tags == null) ? {} : data.tags
            data.picture_url = (data.picture_url == null) ? "" : data.picture_url
            if (data.contact) {
                data.contact.telephone_numbers = (data.contact.telephone_numbers == null) ? "Unspecified" : data.contact.telephone_numbers
                data.contact.emails = (data.contact.emails == null) ? "Unspecified" : data.contact.emails
            }
            $('#header').append(`
            <div id="bttn" onclick="window.location='/booking/${data.uuid}';">Rezervovat Lektora!</div>
        `)

            $('body').append(`
                <div class='lecturer' id='${data.uuid}'>
                    <div id="content-container">
                        <div id="main-info-container"> </div>
                        <div id="secondary-info-container"> </div>
                    </div>
                    <div id="uuid">${data.uuid}</div>
                </div>
                <br></br>
                `)
            $(`#${data.uuid} #main-info-container`).append(`
                    <img id="teacher-image" src="${data.picture_url}" alt="Image of the data">  \
                    <div></div>
                    <div id="teacher-name">

                    </div>
                    <h2 id="teacher-location">⚲ ${data.location}</h2>
                    <h3 id="teacher-claim">${data.claim}</h3>
                </div>
                `)
            $(`#${data.uuid} #secondary-info-container`).append(`
                    <div id="desc-container"> </div>
                    <div id="tags-container"> </div>
                    `)
            $(`#${data.uuid} #desc-container`).append(`
                        <h4 id="desc-text">
                            <p>
                            ${data.bio}
                            </p>
                        </h4>
                        <h3 id="teacher-contact">tel. ${data.contact.telephone_numbers}, e-mail: ${data.contact.emails}, cena za hodinu: ${data.price_per_hour}</h3>
                        <img id="tda-icon-desc" src="/images/TdA-icons/SVG/TdA_ikony_nastaveni_white.svg" alt="icon">
                    `)
            $.each(data.tags, function (j) {
                $(`#${data.uuid} #tags-container`).append(`<div class="tag">${data.tags[j].name}</div>`)
            });

            if (data.title_before) {
                $("#teacher-name").append(`<h2>${data.title_before}</h2>`)
            }
            if (data.first_name) {
                $("#teacher-name").append(`<h1>${data.first_name}</h1>`)
            }
            if (data.middle_name) {
                $("#teacher-name").append(`<h1>${data.middle_name}</h1>`)
            }
            if (data.last_name) {
                $("#teacher-name").append(`<h1>${data.last_name}</h1>`)
            }
            if (data.title_after) {
                $("#teacher-name").append(`<h2>${data.title_after}</h2>`)
            }
        }
    });
});
