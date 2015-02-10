var map;
var infowindow;

function initialize_map(el, lat, lon) {
  var location = new google.maps.LatLng(lat, lon);

  map = new google.maps.Map(document.getElementById(el), {
    center: location,
    zoom: 14
  });

  var request = {
    location: location,
    radius: 10000,
    types: [
      'restaurant',
      'bank',
      'grocery_or_supermarket',
      'museum',
      'place_of_worship',
      'airport'
    ]
  };

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);

  });
}
