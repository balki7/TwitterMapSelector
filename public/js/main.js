$(document).ready(() => {
    $('#details').hide();

    $('#search').click(() => {
        $('#tweets').empty();
        let text = $('#text').val();
        if(text && text.length > 0) {
            $.blockUI({ message: '<h3>Just a moment...</h3>' });

            let data = {};
            data.filter = text;

            $.ajax({
                type: 'GET',
                data: data,
                contentType: 'application/json',
                url: '/searchTweets',
                success: function(data) {
                    $.unblockUI();
                    $('#tweetText').html(text);
                    $('#details').show();


                    let rectangle = {
                        minLng : null,
                        maxLng : null,
                        minLat : null,
                        maxLat : null
                    };

                    let mapArray = new Array();
                    for (let index in data){
                        let tweet = data[index];
                        let lat = tweet.geo.coordinates[0];
                        let lng = tweet.geo.coordinates[1];

                        if(rectangle.minLat){
                            if(lat < rectangle.minLat){
                                rectangle.minLat = lat;
                            }
                        }
                        else{
                            rectangle.minLat = lat;
                        }

                        if(rectangle.minLng){
                            if(lng < rectangle.minLng){
                                rectangle.minLng = lng;
                            }
                        }
                        else{
                            rectangle.minLng = lng;
                        }

                        if(rectangle.maxLat){
                            if(lat > rectangle.maxLat){
                                rectangle.maxLat = lat;
                            }
                        }
                        else{
                            rectangle.maxLat = lat;
                        }

                        if(rectangle.maxLng){
                            if(lng > rectangle.maxLng){
                                rectangle.maxLng = lng;
                            }
                        }
                        else{
                            rectangle.maxLng = lng;
                        }

                        mapArray.push({
                            label : (Number(index) + 1).toString(),
                            lat : lat,
                            lng : lng,
                            context : tweet.text
                        });

                        if(tweet.place) {
                            $tweet = $('<h4>' + (Number(index) + 1) + ' : ' + tweet.text + '</h4><p>' + tweet.place.full_name + ' - ' + tweet.place.country + ' Lat : ' + lat + ' Lng : ' + lng + '</p>');
                        }
                        else{
                            $tweet = $('<h4>' + (Number(index) + 1) + ' : ' + tweet.text + '</h4><p>Lat : ' + lat + ' Lng : ' + lng + '</p>');
                        }
                        $('#tweets').append($tweet);
                    }

                    let centerLocation = {
                        lat : (rectangle.minLat + rectangle.maxLat) / 2,
                        lng : (rectangle.minLng + rectangle.maxLng) / 2
                    };

                    initializeMap(centerLocation, mapArray, rectangle);
                },
                error: function(response, error, message){
                    $('#status span').html('Error : ' + response.status + ' - ' + error + '<br>' + message);
                    $('#status span').css('color', 'red');
                    $('#status').show();
                    $.unblockUI();
                    $('#results').hide();
                }
            });
        }
        else{
            $('#status span').html('Empty text!<br>Please type something.');
            $('#status span').css('color', 'red');
            $('#status').show();
            $('#results').hide();
        }
    });

    function addMapMarker(location, map, label, context) {
        let marker = new google.maps.Marker({
            position: location,
            label: label,
            map: map
        });

        let infowindow = new google.maps.InfoWindow({
            content: context,
            maxWidth: 200
        });

        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
    }

    function initializeMap(location, data, rectangle) {
        let map = new google.maps.Map(document.getElementById('map'), {
            zoom: 1,
            center: location
        });

        for(let marker of data) {
            addMapMarker({ lat : marker.lat, lng : marker.lng}, map, marker.label, marker.context);
        }

        var rectangle = new google.maps.Rectangle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.25,
            map: map,
            bounds: {
                north: rectangle.maxLat,
                south: rectangle.minLat,
                east: rectangle.maxLng,
                west: rectangle.minLng
            }
        });
    }
});