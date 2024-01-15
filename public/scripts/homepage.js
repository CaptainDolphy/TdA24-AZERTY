$(document).ready(function () {
    $.getJSON(`http://${location.hostname}/api/lecturers`).done(function(data) {
        $.each(data, function(i) {
            $('#lecturer-list').append(`
                <div class='lecturer' id='${data[i].uuid}' onclick="window.location='/lecturer/${data[i].uuid}';"> 
                    <div id="content-container"> 
                        <div id="main-info-container"> </div>
                    </div>
                </div>
                `)
            $(`#lecturer-list #${data[i].uuid} #main-info-container`).append(`        
                    <img id="teacher-image" src="${data[0].picture_url}" alt="image of the lecturer">  \
                    <div></div> 
                    <div id="teacher-name"> 
                        <h2>${data[i].title_before}</h2> 
                        <h1>${data[i].first_name} ${data[i].middle_name} ${data[0].last_name}</h1> 
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
            
            $('#locSelect').append(`<option value="${data[i].location}">${data[i].location}</option>`)

            // Tag Options + Display on card
    
            $.each(data[i].tags[0], function(j) {
                $(`#${data[i].uuid} #tags-container`).append(`<div class="tag">${data[i].tags[0][j]}</div>`);
                $('#tagSelect').append(`<option value="${data[i].tags[0][j]}">${data[i].tags[0][j]}</option>`);
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

                // Check for price
                if(!(i.price_per_hour < $("#slider-range").slider("values", 0)) && !(i.price_per_hour > $("#slider-range").slider("values", 1))) {
                    filtered.push(i.uuid);
                }

                // Check for tags
                selTags=[]
                $.each($('#tagSelect').select2('data'), function(j) {
                    selTags.push($('#tagSelect').select2('data')[j].text)
            
                })
                $.each(i.tags[0], function(j) {
                    if (selTags.includes((i.tags[0][j]),0)) {
                        filtered.push(i.uuid);
                    };
                });

                // Check location

                selLocs=[]
                $.each($('#locSelect').select2('data'), function(j) {
                    selLocs.push($('#locSelect').select2('data')[j].text)
                })
                
                if (selLocs.includes((i.location),0)) {
                    filtered.push(i.uuid);
                };

            })
            
            // Show filtered items

            $.each(filtered, function(i) {
                $('.lecturer').filter(`#${filtered[i]}`).show();
            })

        });

     
});
});