var setUrlToPoint = function(point) {
	if (!window.history) {
		return;
	}

	var newUrl = window.location.protocol + "//" +
		window.location.host + window.location.pathname +
		'?lat=' + point.lat +
		'&lng=' + point.lng;

	window.history.replaceState(null, null, newUrl);
};

var initMap = function() {
	var center = FB_EV_MAP.DEFAULT_MAP_CENTER;

	if (window.location.search) {
		(function() {
			var latMatch = window.location.search.match(/lat=([+-]?\d+(\.\d+)?)/);
			var lngMatch = window.location.search.match(/lng=([+-]?\d+(\.\d+)?)/);

			if (latMatch && latMatch[1] && lngMatch && lngMatch[1]) {
				center = {
					lat: parseFloat(latMatch[1]),
					lng: parseFloat(lngMatch[1])
				};
			}
		})();
	}

	var searchInput = document.getElementById('location-search-input');
	var brandingContainer = document.getElementById('branding');

	var map = new Map(document.getElementById('map'), center);

	map.addSearchBox(searchInput, function(newCenter) {
		map.moveView(newCenter);
		map.resetZoom();
		setUrlToPoint(newCenter);

		Places.getPlacesNearPoint(newCenter.lat, newCenter.lng, map);
	});
	map.addBranding(brandingContainer);

	map.addClickListener(function(event) {
		var lat = event.latLng.lat();
		var lng = event.latLng.lng();
		setUrlToPoint({
			lat: lat,
			lng: lng
		});

		Places.getPlacesNearPoint(lat, lng, map);
	});

	(function() {
		var searchNotifCancelled = false;

		$(searchInput).on('focus', function() {
			searchNotifCancelled = true;
		});

		setTimeout(function() {
			if (searchNotifCancelled) {
				return;
			}

			toastr.success('You can also search for your favourite place in the searchbox in the top left corner.', null, {
				timeOut: 5000,
				closeButton: true
			});
		}, 5000);
	})();

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;

			map.moveView({
				lat: lat,
				lng: lng
			});
			map.resetZoom();
			setUrlToPoint({
				lat: lat,
				lng: lng
			});

			Places.getPlacesNearPoint(lat, lng, map);
		});

		toastr.success('Allow this page to access your location or click on the map to show nearby Facebook events!', 'What is this?', {
			timeOut: 10000,
			closeButton: true
		});
	} else {
		toastr.success('Click on the map to show nearby Facebook events!', 'What is this?', {
			timeOut: 10000,
			closeButton: true
		});
	}
};
