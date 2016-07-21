requirejs.config({
    baseUrl: 'resources/javascript/',
    paths: {
    	jquery: 'https://code.jquery.com/jquery-3.0.0.min',
		home: 'home',
		header: "header",
		play: "play",
		signin: "sign-in",

		firebase_app  : 'https://www.gstatic.com/firebasejs/3.1.0/firebase-app',
		firebase_auth : 'https://www.gstatic.com/firebasejs/3.1.0/firebase-auth',
		firebase_db   : 'https://www.gstatic.com/firebasejs/3.1.0/firebase-database',
		firebase      : 'https://www.gstatic.com/firebasejs/3.1.0/firebase'
    },
	shim: {


		'firebase': {
			deps:   ['firebase_app', 'firebase_auth', 'firebase_db'],
			exports: 'firebase',
			init: function() {
				var config = {
					apiKey: "AIzaSyCKpE3eKqYBpSCf0EXlfC-CfRiFDQRvVB4",
					authDomain: "codinames-b9676.firebaseapp.com",
					databaseURL: "https://codinames-b9676.firebaseio.com",
					storageBucket: "codinames-b9676.appspot.com",
				};
				this.firebase.initializeApp(config);
			}
		}

	}

});