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
    zoom: 14,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_LEFT
    },
    zoomControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT
    },
    zoomControl: true,
    streetViewControl: true
  });

  var yourLocationMarkerIcon = {
    url: 'https://cdn3.iconfinder.com/data/icons/softwaredemo/PNG/256x256/DrawingPin1_Blue.png',
    scaledSize: new google.maps.Size(25, 25),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(10, 0)
  };

  var yourLocationMarker = new google.maps.Marker({
    position: location,
    map: map,
    icon: yourLocationMarkerIcon
  });

  google.maps.event.addListener(yourLocationMarker, 'click', function() {
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

function resetActiveClasses() {
  mapControls.each(function(i, el) {
    _$(el).removeClass('active');
  });
}
