var map;
var infowindow;

function initialize_map(el, lat, lon, locationMarkerText) {
  var location = new google.maps.LatLng(lat, lon);

  map = new google.maps.Map(document.getElementById(el), {
    center: location,
    zoom: 14
  });

  var locationMarker = new google.maps.Marker({
    position: location,
    map: map
  });

  google.maps.event.addListener(locationMarker, 'click', function() {
    infowindow.setContent(locationMarkerText);
    infowindow.open(map, this);
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

function callback(results, status, pagination) {
  if (status != google.maps.places.PlacesServiceStatus.OK) {
    return;
  } else {
    createMarkers(results);
    if (pagination.hasNextPage) {
      pagination.nextPage();
    }
  }
}

function createMarkers(places) {
  for (var i = 0, place; place = places[i]; i++) {
    var name = place.name;

    var placeIcon = {
      url: place.icon,
      scaledSize: new google.maps.Size(25, 25),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(10, 0)
    };

    var marker = new google.maps.Marker({
      map: map,
      icon: placeIcon,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(name);
      infowindow.open(map, this);
    });
  }
}
