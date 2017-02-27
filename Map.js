var Map = function(container, center) {
	var gMap = new google.maps.Map(container, {
		zoom: FB_EV_MAP.DEFAULT_MAP_ZOOM,
		center: center,
		mapTypeControl: false,
		streetViewControl: false
	});

	var currentOpenInfoWindow = null;

	return {
		moveView: function(newCenter) {
			gMap.setCenter(newCenter);
		},
		resetZoom: function() {
			gMap.setZoom(FB_EV_MAP.DEFAULT_MAP_ZOOM);
		},
		addClickListener: function(fn) {
			google.maps.event.addListener(gMap, 'click', fn);
		},
		addMarkerWithDescription: function(lat, lng, label, desc) {
			var marker = new google.maps.Marker({
				position: {
					lat: lat,
					lng: lng
				},
				map: gMap,
				label: label ? label + '' : null
			});

			var infoWindow = new google.maps.InfoWindow({
				content: desc
			});

			marker.addListener('click', function() {
				if (currentOpenInfoWindow) {
					currentOpenInfoWindow.close();
				}

				currentOpenInfoWindow = infoWindow;
				infoWindow.open(gMap, marker);
			});

			return {
				marker: marker,
				infoWindow: infoWindow
			};
		},
		addSearchBox: function(searchBoxElement, onSearchResult) {
			var searchBox = new google.maps.places.SearchBox(searchBoxElement);
			gMap.controls[google.maps.ControlPosition.LEFT_TOP].push(searchBoxElement);

			searchBox.addListener('places_changed', function() {
				var searchPlaces = searchBox.getPlaces();

				if (searchPlaces.length === 0) {
					return;
				}

				var place = searchPlaces[0];

				if (!place.geometry) {
					return;
				}

				var newCenter = place.geometry.location;

				onSearchResult({
					lat: newCenter.lat(),
					lng: newCenter.lng()
				});
			});
		},
		addControl: function(el, position) {
			gMap.controls[position].push(el);
		}
	};
};
