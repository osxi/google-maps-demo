var map,
    infowindow,
    currentType,
    markersArray = [];

function initialize_map(el, lat, lon, locationMarkerText, showType) {
  var location = new google.maps.LatLng(lat, lon);

  if (showType !== undefined) {
    currentType = showType[0];
  }
  // console.log('currentType', currentType);

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
    types: showType
  };

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status, pagination) {
  if (status != google.maps.places.PlacesServiceStatus.OK) {
    return;
  } else {
    createMarkers(results, currentType).then(function() {
      console.log('done making markers');
    });

    if (pagination.hasNextPage) {
      pagination.nextPage();
    }

    clearMarkers(null);
    clearMarkers(currentType);
  }
}

function createMarker(place, placeType) {
  var placeLoc = place.geometry.location;

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

  markersArray.push([currentType, marker]);

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

function createMarkers(places, placeType) {
  var deferred = $.Deferred();

  deferred.resolve(function() {
    for (var i = 0, place; place = places[i]; i++) {
      createMarker(place, placeType);
    }
  });

  return deferred.promise();
}

function clearMarkers(filterByType) {
  $.each(markersArray, function(i, el) {
    try {
      if (el[0] === filterByType) {
	el[1].setMap(map);
      } else {
	el[1].setMap(null);
	// markersArray.splice(i, 1);
      }
    } catch(err) {
      console.log('something broke: ', err);
      markersArray.splice(i, 1);
    }
  });
}
