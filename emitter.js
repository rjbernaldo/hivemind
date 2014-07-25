// emit new message
module.exports = function(io) {
		setInterval(function() { // think of this as the twitter loop
			// 1st task (VIEW)
			var data = "TEST!";
			emitTweet(io, data);

			// 2nd task (MODEL)
			saveToMongo(data);
		},500);
}

// VIEW TASK
function emitTweet(io, data) {
	io.sockets.emit('new message', data);
}

function saveToMongo(data) {
	console.log(data);
}
