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

	TWEEN.start();
	window.onload = function() {
		var collection = [];
		document.body.style.backgroundImage = 'none';

		var socket = io.connect('http://localhost');

		// UI.TweetCount.init();
  //   UI.HashtagCount.init();

		socket.on('newGlobeTweet', function(data) {
			var longtitude = data[1];
			var latitude = data[0];
			var magnitude = 0.9;
			var coord = [longtitude, latitude, magnitude];

			collection.push(longtitude);
			collection.push(latitude);
			collection.push(magnitude);

			UI.TweetCount.update();

			renderPoints();

		});
		var hashtagCounter = 0;

		socket.on('newHashtag', function(data){
			UI.HashtagCount.update(data);
		});

		function renderPoints() {
			globe.addData(collection, {format: 'magnitude', name: "tweets", animated: true});
			collection = []
			globe.createPoints();
		}
		globe.animate();
	}

}
