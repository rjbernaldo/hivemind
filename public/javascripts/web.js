$(document).ready(function() {
  var socket = io.connect('/');
  socket.on('new message', createNewDivElement(data));
})

function createNewDivElement(data) {
  var div = document.createElement('div');
  div.innerHTML = data.text;
  document.body.appendChild(div);
}
