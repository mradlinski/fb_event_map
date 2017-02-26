var FBLogin = (function() {
	var STORAGE_KEY = 'FB_EV_MAP_TOKEN';
	var facebookToken = null;
	var fbLoginModal = null;

	(function() {
		var storedToken = JSON.parse(localStorage.getItem(STORAGE_KEY));

		if (storedToken) {
			facebookToken = storedToken;
		}
	})();

	var getFBToken = function() {
		if (facebookToken && facebookToken.expires <= Date.now()) {
			facebookToken = null;
		}

		return facebookToken ? facebookToken.token : null;
	};

	var resetFBToken = function() {
		facebookToken = null;
		localStorage.removeItem(STORAGE_KEY);
	};

	var initializeFB = function() {
		window.fbAsyncInit = function() {
			FB.init({
				appId: '428176257526452',
				cookie: true,
				xfbml: true,
				version: 'v2.8'
			});
		};

		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s);
			js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	};

	var onFBLogin = function() {
		if (fbLoginModal) {
			fbLoginModal.close();
			fbLoginModal = null;
		}

		FB.getLoginStatus(function(response) {
			if (response.status === 'connected' && response.authResponse) {
				toastr.success('Thank you for supporting us!');
				facebookToken = {
					token: response.authResponse.accessToken,
					expires: Date.now() + (response.authResponse.expiresIn * 1000)
				};

				localStorage.setItem(STORAGE_KEY, JSON.stringify(facebookToken));
			}
		});
	};

	var promptFacebookLogin = function() {
		initializeFB();
		fbLoginModal = $('[data-remodal-id=fb-login-modal]').remodal({
			hashTracking: false,
			closeOnConfirm: false,
			closeOnCancel: false,
			closeOnEscape: false,
			closeOnOutsideClick: false
		});

		fbLoginModal.open();
	};

	return {
		getFBToken: getFBToken,
		resetFBToken: resetFBToken,
		promptFacebookLogin: promptFacebookLogin,
		onFBLogin: onFBLogin
	};
})();
