if(!Detector.webgl){
	Detector.addGetWebGLMessage();
} else {
	var container = document.getElementById('container');
	var globe = new DAT.Globe(container);

	// var settime = function(globe) {
	// 	return function() {
	// 		new TWEEN.Tween(globe).to({time: 0},500).easing(TWEEN.Easing.Cubic.EaseOut).start();
	// 	};
	// };
	// function settime(globe) {
	// 	new TWEEN.Tween(globe).to({time: 0},500).easing(TWEEN.Easing.Cubic.EaseOut).start();
	// };

	// TWEEN.start();
	window.onload = function() {
		
		document.body.style.backgroundImage = 'none';

		var hashtagCounter = 0;
		var socket = io.connect('/');

		socket.on('newGlobeTweet', function(data) {
			var longtitude = data[1];
			var latitude = data[0];

			UI.TweetCount.update();

			renderPoints(longtitude, latitude);
		});

		socket.on('newHashtag', function(data){
			UI.HashtagCount.update(data);
		});

		UI.SessionTimer.update()

		globe.animate();
	}
}

function renderPoints(longtitude, latitude) {
	var collection = [longtitude, latitude, 0.9];
	globe.addData(collection, {format: 'magnitude', name: "tweets", animated: true});
	globe.createPoints();
}
