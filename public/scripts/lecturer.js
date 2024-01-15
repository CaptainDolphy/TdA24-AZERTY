$(document).ready(function () {
    $.getJSON(`http://${location.host}/api/lecturers/${uuid} `).done(function(data) {
            $('body').append(`
                <div class='lecturer' id='${data.uuid}'> 
                    <div id="content-container"> 
                        <div id="main-info-container"> </div>
                        <div id="secondary-info-container"> </div>
                    </div>
                    <div id="uuid">${data.uuid}</div> 
                    <img id="tda-logo" src="/images/TdA-logo/TeacherDigitalAgency_LOGO_colour-white.png" alt="tda logo">
                </div>
                <br></br>
                `)
            $(`#${data.uuid} #main-info-container`).append(`        
                    <img id="teacher-image" src="${data.picture_url}" alt="image of the lecturer">  \
                    <div></div> 
                    <a class="page-link" href="/api/lecturers/${data.uuid}">${data.uuid}</a> 
                    <div id="teacher-name"> 
                        <h2>${data.title_before}</h2> 
                        <h1>${data.first_name} ${data.middle_name} ${data.last_name}</h1> 
                        <h2>${data.title_after}</h2> 
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
            $.each(data.tags[0], function(j) {
                $(`#${data.uuid} #tags-container`).append(`<div class="tag">${data.tags[0][j]}</div>`)
            }); 
        });       
    });
