var Twitter = require('twitter')
var mongojs = require('mongojs')
var consumer_key = process.env.CONSUMER_KEY
var consumer_secret = process.env.CONSUMER_SECRET
var access_token_key = process.env.ACCESS_TOKEN_KEY
var access_token_secret = process.env.ACCESS_TOKEN_SECRET
var dbuser = process.env.DBUSER
var dbpass = process.env.DBPASSWORD
var db = mongojs('tweets')
var HOUR = 3600000
var DAY = 86400000
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
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
    access_token_key: access_token_key,
    access_token_secret: access_token_secret
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
  return {
    renderOnCharts: function(io, updatedCount){
      io.sockets.emit('new count', updatedCount)
    }
  }
})();

// db Model

var dbModel = (function(){

})();

// db Controller

var dbController = (function(view, model){
  // Remove hashtags where count = 1 every hour
  setInterval(removeOldHashtagCounts, HOUR)

  function removeOldHashtagCounts(){
    db.collection('hashtagCount').remove({ value: 1 })
  }

  return {
    view: view,
    model: model,

    sendToInfoView: function(io, updatedCount){
      view.renderOnCharts(io, updatedCount);
    },

    parseRawTweet: function(io, tweet){
      var timestamp = tweet.created_at;

      if (tweet.entities && tweet.entities.hashtags.length > 0) {
        tweet.entities.hashtags.forEach(function(tag) {
          db.collection('tweets').insert( {created_at: timestamp, hashtag: tag.text, timestamp: Date.parse(timestamp) } );

          function map() { emit( this.hashtag, 1 ) }
          function reduce(key, values) { return Array.sum(values) }
          function finalize(key, value) { return { value: value, time: Date.now() } }

          db.collection('tweets').mapReduce(map, reduce, {
                        query: { hashtag: tag.text },
                        out: { merge: "hashtagCount" }
                        // finalize: finalize
                        });
          // Remove tweets that came in more than an hour ago
          db.collection('tweets').remove( { timestamp: { "$lt": Date.now() - DAY } } )
        // DO NOT DELETE - find the top 5 most used hashtags in database

        });
        // Send to infographics view
        setInterval(function(){
          // db.collection('hashtagCount').ensureIndex( { value: -1 })
          var updatedCount = db.collection('hashtagCount').find( { $query: {}, $orderby: { value: -1 } } ).limit(5).toArray(function(err, results){
            console.log(results)
          })
          // this.sendToInfoView(io, updatedCount)
        }, 5000)
        // console.log(updatedCount)

      }
    }
  }

})(dbView, dbModel);
