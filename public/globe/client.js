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
		var collection = [];
		document.body.style.backgroundImage = 'none';

		var socket = io.connect('http://localhost')

		socket.on('newGlobeTweet', function(data) {
			var longtitude = data[1];
			var latitude = data[0];
			var magnitude = 0.9;
			var coord = [longtitude, latitude, magnitude];

			collection.push(longtitude);
			collection.push(latitude);
			collection.push(magnitude);

			test();
			// globe.addData(collection, {format: 'magnitude', name: "tweets", animated: true});
			// globe.createPoints();

		});
		function test() {
			globe.addData(collection, {format: 'magnitude', name: "tweets", animated: true});
			collection = []
			globe.createPoints();
		}
		globe.animate();
	}
	// var xhr;
	// xhr = new XMLHttpRequest();
	// xhr.open('GET', '/globe/population909500.json', true);
	// xhr.onreadystatechange = function(e) {
	// 	if (xhr.readyState === 4) {
	// 		if (xhr.status === 200) {
	// 			var data = JSON.parse(xhr.responseText);
	// 			window.data = data;
	// 			for (i=0;i<data.length;i++) {
	// 				globe.addData(data[i][1], {format: 'magnitude', name: data[i][0], animated: true});
	// 			}
	// 			globe.createPoints();
	// 			// settime(globe)();
	// 			settime(globe);
	// 			globe.animate();
	// 			document.body.style.backgroundImage = 'none'; // remove loading
	// 		}
	// 	}
	// };
	// xhr.send(null);
}
