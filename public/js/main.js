$(document).ready(() => {
    $('#details').hide();

    $('#search').click(() => {
        search();
    });

    $("#text").on('keyup', function (e) {
        if (e.keyCode == 13) {
            search();
        }
    });
});

let search = (bounds) => {
    let text = $('#text').val();
    $.blockUI({ message: '<h3>Just a moment...</h3>' });

    let data = {};
    data.filter = text;
    if(bounds){
        data.bounds = bounds;
    }

    $.ajax({
        type: 'GET',
        data: data,
        contentType: 'application/json',
        url: '/searchTweets',
        success: function(data) {
            $.unblockUI();
            $('#details').show();

            let tweets = new Array();
            for (let index in data){
                let tweet = data[index];
                let lat = tweet.geo.coordinates[0];
                let lng = tweet.geo.coordinates[1];

                if(!tweet.place) {
                    tweet.place = {
                        full_name: null,
                        country: null
                    };
                }

                tweets.push({
                    index : (Number(index) + 1),
                    tweet : tweet.text,
                    place : tweet.place.full_name,
                    country:  tweet.place.country,
                    longitude : lng,
                    latitude : lat
                });
            }

            $('#tableContainer').empty();
            $table = $('<table id="table"></table>');
            $('#tableContainer').append($table);

            $('#table').bootstrapTable({
                columns: [{
                    field: 'index',
                    title: 'Index'
                }, {
                    field: 'tweet',
                    title: 'Tweet'
                }, {
                    field: 'place',
                    title: 'Place'
                }, {
                    field: 'country',
                    title: 'Country'
                }, {
                    field: 'longitude',
                    title: 'Longitude'
                }, {
                    field: 'latitude',
                    title: 'Latitude'
                }],
                data: tweets,
                search: true,
                pagination: true
            });

            $('#tweetText').html(text + " - " + tweets.length + " Results");
            $('#table tr').click((event) => {
                let row = $(event.target).parent();
                let lng = Number($(row).find("td:nth-child(5)")[0].textContent);
                let lat = Number($(row).find("td:nth-child(6)")[0].textContent);

                Map.center(lng, lat);
            });

            Map.init(tweets);
        },
        error: function(response, error, message){
            $('#status span').html('Error : ' + response.status + ' - ' + error + '<br>' + message);
            $('#status span').css('color', 'red');
            $('#status').show();
            $.unblockUI();
            $('#results').hide();
        }
    });
};

let Map = {
    map: null,
    init: (data) => {
        Map.map = new google.maps.Map(document.getElementById('map'), {});

        let bounds = new google.maps.LatLngBounds();
        for(let marker of data) {
            if(marker.longitude > -180 && marker.longitude < 180 && marker.latitude > -90 && marker.latitude < 90) {
                let m = Map.addMarker({
                    lng: marker.longitude,
                    lat: marker.latitude
                }, marker.index.toString(), marker.tweet);
                bounds.extend(m.getPosition());
            }
            else{
                console.warn("Illegal coordinates : ", marker);
            }
        }
        Map.map.fitBounds(bounds);

        Map.drawRectangle();
    },
    addMarker: (location, label, context) => {
        let marker = new google.maps.Marker({
            position: location,
            label: label,
            map: Map.map
        });

        let infowindow = new google.maps.InfoWindow({
            content: context,
            maxWidth: 200
        });

        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });

        return marker;
    },
    drawRectangle: () => {
        let drawingManager = new google.maps.drawing.DrawingManager({
            //drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['rectangle']
            },
            circleOptions: {
                fillColor: '#ffff00',
                fillOpacity: 1,
                strokeWeight: 5,
                clickable: false,
                editable: true,
                zIndex: 1
            }
        });
        drawingManager.setMap(Map.map);

        google.maps.event.addListener(drawingManager, 'rectanglecomplete', (selection) => {
            let bounds = selection.getBounds();
            search({
                lng: {
                    min: bounds.f.b,
                    max: bounds.f.f
                },
                lat: {
                    min: bounds.b.b,
                    max: bounds.b.f
                }
            });
        });
    },
    center: (lng, lat) => {
        let position = new google.maps.LatLng(lat, lng);
        Map.map.setCenter(position);
        Map.map.setZoom(12);
    }
};