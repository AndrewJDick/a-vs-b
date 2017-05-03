export default function initMap() {

  // Generate the map, centering on the UK
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 56.015425, lng: -4.174804},
    zoom: 5,
    disableDefaultUI: true
  });

  var card = document.getElementById('pac-card');
  var input = document.getElementById('pac-input');
  var types = document.getElementById('type-selector');
  var strictBounds = document.getElementById('strict-bounds-selector');

  // Absolutely position the search bar on the map
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

  // Add postcode layer to the map
  // var src = 'http://raw.githubusercontent.com/AndrewJDick/a-vs-b/develop/src/media/kml/postcode-boundaries.kml';
  // var kmlLayer = new google.maps.KmlLayer(src, {
  //   suppressInfoWindows: true,
  //   preserveViewport: false,
  //   map: map
  // });

  // google.maps.event.addListener(kmlLayer, 'click', function(kmlEvent) {
  //    console.log(kmlLayer.getMetadata());
  // })


  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  autocomplete.setTypes(['geocode']);
  autocomplete.setOptions({
      strictBounds: true
  });
  autocomplete.setComponentRestrictions({
      'country': ['gb']
  });


  // Info Windows
  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');

  infowindow.setContent(infowindowContent);

  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    var district = '';
    var town = '';

    // Retrieve the Town and the District from the autocompleted place object
    if (place.address_components) {

      for (let i = 0; i < place.address_components.length; i++) {
          for (let j = 0; j < place.address_components[i].types.length; j++) {
              if (place.address_components[i].types[j] === 'postal_code') {
                  district = place.address_components[i].long_name.split(/(\s+)/)[0];
              }
              if (place.address_components[i].types[j] === 'postal_town' ) {
                  town = place.address_components[i].long_name;
              }
          }
      }
    }

    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }

    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    infowindowContent.children['place-address'].textContent = `${district}, ${town}`;
    infowindowContent.children['place-copy'].textContent = `According to our data, ${district} is 74% cat people.`;

    infowindow.open(map, marker);
  });
}
