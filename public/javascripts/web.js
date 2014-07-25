window.onload = function() {
	var socket = io.connect('http://localhost')
	socket.on('connection', function(socket) {
		console.log('Connected');
	});
	socket.on('new message', function() {
		console.log("hehe")
	});
}
