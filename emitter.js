var Twitter = require('twitter');

var twitter = new Twitter({
    consumer_key: 'i1k8pKNzfJLMi8d9F6ISbs7SV',
    consumer_secret: 'zUHEYmnHhlSQwQoS8PczLYKOBnrVQErjJzJ0et6DgZMT4jw78W',
    access_token_key: '2678182524-WsHJJGoyzQft2XpBcPNu4ByGmWYkl4F89ELYApX',
    access_token_secret: '4U2HJbntXykhMhLQyAptI5RRXVoWrrltOCnsne3aKpgEt'
});

twitter.stream('statuses/sample', function(stream) {
  stream.on('data', function(data) {
    if (data.entities && data.entities.hashtags.length > 0) {
      for (var i = 0; i < data.entities.hashtags.length; i++) {
        console.log(data.entities.hashtags[i].text);
      }
    }
  });
});

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

