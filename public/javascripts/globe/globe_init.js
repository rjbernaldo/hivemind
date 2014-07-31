if(!Detector.webgl){
	Detector.addGetWebGLMessage();
} else {
	var container = document.getElementById('container'),
			globe = new DAT.Globe(container),
			hashtagCounter = 0,
			timeCounter = 0;

	window.onload = init;
}

function init() {
	var socket = io.connect('/');

	socket.on('newGlobeTweet', globeEvent);
	socket.on('newHashtag', hashtagEvent);

	initTimeCounter();
	globe.animate();
}

function globeEvent(data) {
	UI.TweetCount.update();
	renderPoints(data[1], data[0]);
}

function hashtagEvent(data) {
	UI.HashtagCount.update(data);
}

function renderPoints(longtitude, latitude) {
	var collection = [longtitude, latitude, 0.9];
	globe.addData(collection, {format: 'magnitude', name: "tweets", animated: true});
	globe.createPoints();
}

function initTimeCounter(){
	setInterval(function () {
		timeCounter++;
		UI.SessionTimer.update(timeCounter)
	}, 1000);
}
