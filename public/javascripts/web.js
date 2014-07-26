window.onload = function() {
	var socket = io.connect('http://localhost')

	socket.on('new message', function(data) {
    var div = document.createElement('div')
    div.innerHTML = data.text
		document.body.appendChild(div);
	});
}
