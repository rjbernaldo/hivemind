window.onload = function() {
	var socket = io.connect('http://localhost')

	socket.on('new message', function(data) {
		console.log(data)
	});
}
