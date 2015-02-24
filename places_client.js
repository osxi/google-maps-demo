var map,
    infoWindow,
    currentType,
    keyWordOverride,
    service;

function initialize_map(el, lat, lon, locationMarkerText, showType, keyWord) {
  var location = new google.maps.LatLng(lat, lon);

  currentType = showType;
  keyWordOverride = keyWord;

  map = new google.maps.Map(document.getElementById(el), {
    center: location,
    zoom: 12
  });

  var locationMarker = new google.maps.Marker({
    position: location,
    map: map
  });

  google.maps.event.addListener(locationMarker, 'click', function() {
    infoWindow.setContent(locationMarkerText);
    infoWindow.open(map, this);
  });

  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  google.maps.event.addListenerOnce(map, 'bounds_changed', performSearch);
}

function performSearch() {
  var request = {
    bounds: map.getBounds(),
    type: currentType,
    keyword: keyWordOverride || currentType
  };
  service.radarSearch(request, callback);
}

function callback(results, status, pagination) {
  if (status != google.maps.places.PlacesServiceStatus.OK) {
    return;
  }

  for (var i = 0, result; result = results[i]; i++) {
    if (i > 75) { break; }
    createMarker(result);
  }
}

function createMarker(place, placeType) {
  var placeLoc = place.geometry.location;

  // var placeIcon = {
  //   url: place.icon,
  //   scaledSize: new google.maps.Size(25, 25),
  //   origin: new google.maps.Point(0, 0),
  //   anchor: new google.maps.Point(10, 0)
  // };

  var marker = new google.maps.Marker({
    map: map,
    // icon: placeIcon,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        alert(status);
        return;
      }
      infoWindow.setContent(result.name);
      infoWindow.open(map, marker);
    });
  });
}
