var Twitter = require('twitter')
// var counter = 0;

// log the tweets
module.exports = streamTweets;

// TWITTER STREAM
function streamTweets(io) {
  connectToTwitter().stream('filter', { 'locations': '-180,-90,180,90' }, function(stream) {
    stream.on('data', function(data) {
      sendToGlobeController(io, data);
      sendToDBController(io, data);
    });
  });
}

// HELPERS
function connectToTwitter(){
  var twitter = new Twitter({
    consumer_key: 'i1k8pKNzfJLMi8d9F6ISbs7SV',
    consumer_secret: 'zUHEYmnHhlSQwQoS8PczLYKOBnrVQErjJzJ0et6DgZMT4jw78W',
    access_token_key: '2678182524-WsHJJGoyzQft2XpBcPNu4ByGmWYkl4F89ELYApX',
    access_token_secret: '4U2HJbntXykhMhLQyAptI5RRXVoWrrltOCnsne3aKpgEt'
  });
  return twitter
}

function sendToGlobeController(io, data) {
  // TODO require globeController
  globeController.parseCoords(io, data);
}

function sendToDBController(io, data) {
  // TODO: require DBController
  dbController.parseRawTweet(io, data);
}

// Globe View
var globeView = (function() {
  return {
    renderOnGlobe: function(coords){
      // counter++;
    }
  }
})();

// Globe Controller
var globeController = (function(view){
  this.view = view;

  function sendToGlobeView(coords){
    this.view.renderOnGlobe(coords);
  }

  return {
    parseCoords: function(io, data){
      if (data.coordinates){
        // TODO send to view (emit)
        sendToGlobeView(data.coordinates.coordinates)
      }
    }
  }
})(globeView);

// db view
var dbView = (function(){

})();

// db Model

var dbModel = (function(){

})();

// db Controller

var dbController = (function(view, model){
  return {
    view: view,
    model: model,
    parseRawTweet: function(io, tweet){
      var timestamp = tweet.created_at;
      if (tweet.entities && tweet.entities.hashtags.length > 0) {
        tweet.entities.hashtags.forEach(function(tag) {
          console.log(tag.text, timestamp)
          // { timestamp: created_at, hashtags: array of hashtags}
        })
      }
      // TODO var totalTweetCount++;

    }
  }

})(dbView, dbModel);
