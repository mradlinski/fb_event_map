toastr.options.progressBar = true;
toastr.options.extendedTimeOut = 3000;

var initMap = function() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		center: FB_EV_MAP.DEFAULT_MAP_CENTER
	});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			map.setCenter({
				lat: lat,
				lng: lng
			});

			getPlacesNearPoint(lat, lng);
		});

		toastr.success('Allow this page to know your location or click on the map to load nearby Facebook events on the map!', 'What is this?', {
			timeOut: 10000,
			closeButton: true
		});
	} else {
		toastr.success('Click on the map to load nearby Facebook events on the map!', 'What is this?', {
			timeOut: 10000,
			closeButton: true
		});
	}

	var placeLookupTable = {};
	var places = [];
	var currentOpenInfoWindow = null;

	var addMarkerWithDescription = function(lat, lng, label, desc) {
		var marker = new google.maps.Marker({
			position: {
				lat: lat,
				lng: lng
			},
			map: map,
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
			infoWindow.open(map, marker);
		});

		return {
			marker: marker,
			infoWindow: infoWindow
		};
	};

	var garbageCollectPlaces = function() {
		while (places.length > FB_EV_MAP.MAX_PLACES_DISPLAYED) {
			var p = places.shift();

			p.repr.marker.setMap(null);
			p.repr.infoWindow.setMap(null);

			placeLookupTable[p.place.id] = undefined;
		}
	};


	var getPlacesNearPoint = (function() {
		var loadingBlocked = false;
		var timesLoaded = 0;
		var fbLoginPrompted = false;

		return function(lat, lng) {
			if (loadingBlocked) {
				return;
			}

			var fbToken = FBLogin.getFBToken();

			if (!fbLoginPrompted && timesLoaded > FB_EV_MAP.EVENT_LOADS_BEFORE_LOGIN_PROMPT && !fbToken) {
				FBLogin.promptFacebookLogin();
				fbLoginPrompted = true;
				return;
			}

			var loadingToast = toastr.info('Loading locations...', null, {
				timeOut: FB_EV_MAP.API_REQ_TIMEOUT
			});

			loadingBlocked = true;

			return $.get({
				url: FB_EV_MAP.API_URL + '/events',
				data: {
					lat: lat,
					lng: lng
				},
				dataType: 'json',
				headers: {
					'fb-token-auth': fbToken ? fbToken : undefined
				},
				timeout: FB_EV_MAP.API_REQ_TIMEOUT
			}).done(function(res) {
				res.forEach(function(p) {
					if (!placeLookupTable[p.id]) {
						var repr = addMarkerWithDescription(
							p.location.latitude,
							p.location.longitude,
							null,
							p.description
						);

						placeLookupTable[p.id] = true;

						places.push({
							place: p,
							repr: repr
						});
					}
				});

				garbageCollectPlaces();

				timesLoaded += 1;
			}).fail(function(err) {
				toastr.error('Sorry, an error occurred!');

				if (fbToken) {
					FBLogin.resetFBToken();
					FBLogin.promptFacebookLogin();
				}
			}).always(function() {
				loadingBlocked = false;
				toastr.clear(loadingToast);
			});
		};
	})();

	google.maps.event.addListener(map, 'click', function(event) {
		var lat = event.latLng.lat();
		var lng = event.latLng.lng();

		getPlacesNearPoint(lat, lng);
	});
};
