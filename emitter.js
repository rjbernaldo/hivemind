// emit new message
module.exports = function(io) {
		setInterval(function() {
			io.sockets.emit('new message', "TEST!")
		},500)
}
