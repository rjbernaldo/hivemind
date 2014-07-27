var Twitter = require('twitter')
var mongojs = require('mongojs')
var db = mongojs('tweets')
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
    consumer_key: 'JnAtg7w857u8TbY8rKKhGbxDn',
    consumer_secret: '077wuTx92ziHLyDd4pcpeh56ZxUuABWYxH6tbk2d5PU9sKP36r',
    access_token_key: '2683182212-k0oVE7ycyobbRQYVhslCoHtC1ci8WO4TNpGwwmw',
    access_token_secret: 'D5sYiVJ8djyUvl6GygJBHMQbzGdoM2ObDyM3KemU2nG76'
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
    renderOnGlobe: function(io, coords){
      // counter++;
      io.sockets.emit('newGlobeTweet', coords)
    }
  }
})();

// Globe Controller
var globeController = (function(view){
  this.view = view;

  function sendToGlobeView(io, coords){
    this.view.renderOnGlobe(io, coords);
  }

  return {
    parseCoords: function(io, data){
      if (data.coordinates){
        // TODO send to view (emit)
        sendToGlobeView(io, data.coordinates.coordinates)
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
          db.collection('tweets').insert( {created_at: timestamp, hashtag: tag.text, timestamp: Date.parse(timestamp) } );

          function map() { emit( this.hashtag, 1 ) }
          function reduce(key, values) { return Array.sum(values) }
          function finalize(key, value) { return { value: value, time: Date.now() } }

db.collection('tweets').mapReduce(map, reduce, {
                        query: { hashtag: tag.text },
                        out: { merge: "hashtagCount", db: "tweets"},
                        finalize: finalize
                        });

          db.collection('tweets').remove( { timestamp: { "$lt": Date.now() - 86400000 } } )

          // DO NOT DELETE - find the top 5 most used hashtags in database
          // db.hashtagCount.find( { $query: {}, $orderby: { value: -1 } } ).limit(5)
        });
      }
    }
  }

})(dbView, dbModel);
/*
function() {
  db.collection('hashtagCount').findAndModify({
    query: { _id: tag.text },
    update: {
      $addToSet: { value: 1 }
    },
    new: true,
    upsert: true
  });
};

*/
