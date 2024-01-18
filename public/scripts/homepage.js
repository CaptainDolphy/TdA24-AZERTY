$(document).ready(function () {
    $.getJSON(`http://${location.host}/api/lecturers`).done(function(data) {
        $.each(data, function(i) {
        
        
        
        
            data[i].title_before = (data[i].title_before == null)       ? ""            : data[i].title_before
            data[i].middle_name = (data[i].middle_name == null)         ? ""            : data[i].middle_name 
            data[i].title_after = (data[i].title_after == null)         ? ""            : data[i].title_after 
            data[i].location = (data[i].location == null)               ? "Unspecified" : data[i].location
            data[i].claim = (data[i].claim == null)                     ? ""            : data[i].claim  
            data[i].price_per_hour = (data[i].price_per_hour == null)   ? "Unspecified" : data[i].price_per_hour
                 
            data[i].tags = (data[i].tags == null) ? "" : data[i].tags
            
            
            
            
            $('#lecturer-list').append(`
                <div class='lecturer' id='${data[i].uuid}' onclick="window.location='/lecturer/${data[i].uuid}';"> 
                    <div id="content-container"> 
                        <div id="main-info-container"> </div>
                    </div>
                </div>
                `)
            $(`#lecturer-list #${data[i].uuid} #main-info-container`).append(`        
                    <img id="teacher-image" src="${data[i].picture_url}" alt="image of the lecturer">  \
                    <div></div> 
                    <div id="teacher-name"> 
                        <h2>${data[i].title_before}</h2> 
                        <h1>${data[i].first_name} ${data[i].middle_name} ${data[i].last_name}</h1> 
                        <h2>${data[i].title_after}</h2> 
                    </div> 
                    <h2 id="teacher-location">⚲ ${data[i].location}</h2> 
                    <h3 id="teacher-claim">${data[i].claim}</h3> 
                    <h3 id="teach-contact">cena za hodinu: ${data[i].price_per_hour}</h3> 
                    <div id="tags-container"> </div>
                    <br>
                    <div id="uuid">${data[i].uuid}</div> 
                </div>
                `)

            // Location Options
            if ($(`#locSelect #${data[i].location}`).length == 0) {
                $('#locSelect').append(`<option id="${data[i].location}" value="${data[i].location}">${data[i].location}</option>`)
            }

            // Tag Options + Display on card
    
            $.each(data[i].tags[0], function(j) {
                $(`#${data[i].uuid} #tags-container`).append(`<div class="tag">${data[i].tags[0][j]}</div>`);
                if ($(`#tagSelect #${data[i].tags[0][j]}`).length == 0) {
                    $('#tagSelect').append(`<option id="${data[i].tags[0][j]}" value="${data[i].tags[0][j]}">${data[i].tags[0][j]}</option>`);
                }
                // Remove uuid tag from view 
                $(`#${data[i].uuid} #tags-container`).find(`div:contains(${data[i].tags[0].uuid})`).remove()
                $(`#tagSelect`).find(`:contains(${data[i].tags[0].uuid})`).remove()
            });

        
            
        });
        
        $('#display').html('<p> Number of Lecturers: ' + Object.entries(data).length + '</p>');
        
        // Price Filter
        pph=[]
        data.forEach(function (i) { pph.push(i.price_per_hour)})
        pphMax=Math.max.apply(Math,pph);
        pphMin=Math.min.apply(Math,pph);
    
        $( "#slider-range" ).slider({
          range: true,
          min: pphMin,
          max: pphMax,
          values: [pphMin+(pphMax-pphMin)/4, pphMax-(pphMax-pphMin)/4 ],
          slide: function( event, ui ) {
            $( "#amount" ).text( "$" + ui.values[0] + " - $" + ui.values[1] );
          }
        });
        $( "#amount" ).text( "$" + $( "#slider-range" ).slider( "values", 0 ) +
          " - $" + $( "#slider-range" ).slider( "values", 1 ) );

        // Tag Filter
        
        $('#tagSelect').select2({
           placeholder: 'Select Tags',
        });
    
        // Location Filter

        $('#locSelect').select2({
            placeholder: 'Select Location',
         });

        // Filter Button

        $("#bttn").on("click",function() {
            
            $('.lecturer').hide();
            filtered=[]

            data.forEach(function (i) {

                var validPrice = false;
                var validTags = false;
                var validLocs = false;

                // Check for price
                validPrice = (!(i.price_per_hour < $("#slider-range").slider("values", 0)) && !(i.price_per_hour > $("#slider-range").slider("values", 1))) ? true : false
                
                // Check for tags
                selTags=[]
                $.each($('#tagSelect').select2('data'), function(j) {
                    selTags.push($('#tagSelect').select2('data')[j].text)
                })
                $.each(i.tags[0], function(j) {
                    valid = (selTags.includes((i.tags[0][j]),0)) ? true : false
                    if (valid){
                        validTags = true;
                    }
                });
                if (selTags == "") {
                    validTags = true;
                }
                // Check location

                selLocs=[]
                $.each($('#locSelect').select2('data'), function(j) {
                    selLocs.push($('#locSelect').select2('data')[j].text)
                })
                
                validLocs = (selLocs.includes((i.location),0)) ? true : false
                
                if (selLocs == "") {
                    validLocs = true;
                }
                
                //Check for intersetion and filter

                if (validPrice && validTags && validLocs) {
                    filtered.push(i.uuid);
                }

            })
            
            // Show filtered items

            $.each(filtered, function(i) {
                $('.lecturer').filter(`#${filtered[i]}`).show();
            })

        });

     
});
});