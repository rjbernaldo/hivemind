var Twitter = require('twitter')
var mongojs = require('mongojs')
// var consumer_key = process.env.CONSUMER_KEY
// var consumer_secret = process.env.CONSUMER_SECRET
// var access_token_key = process.env.ACCESS_TOKEN_KEY
// var access_token_secret = process.env.ACCESS_TOKEN_SECRET
// var dbuser = process.env.DBUSER
// var dbpass = process.env.DBPASSWORD
// var db = mongojs('mongodb://'+dbuser+':'+dbpass+'@ds059908.mongolab.com:59908/livedata')
var consumer_key = "i1k8pKNzfJLMi8d9F6ISbs7SV"
var consumer_secret = "zUHEYmnHhlSQwQoS8PczLYKOBnrVQErjJzJ0et6DgZMT4jw78W"
var access_token_key = "2678182524-WsHJJGoyzQft2XpBcPNu4ByGmWYkl4F89ELYApX"
var access_token_secret = "4U2HJbntXykhMhLQyAptI5RRXVoWrrltOCnsne3aKpgEt"
var db = mongojs('mydb')
var HOUR = 3600000
var DAY = 86400000
// var counter = 0;

module.exports = function() {
  var master_controller = new MasterController;
  master_controller.connect()
  master_controller.stream()
}


function MasterController() {
  this.API = null;
  this.globe_controller = new GlobeController;
  this.database_controller = new DatabaseController;
}

MasterController.prototype = {
  connect: function() {
    this.API = new Twitter({
      consumer_key: consumer_key,
      consumer_secret: consumer_secret,
      access_token_key: access_token_key,
      access_token_secret: access_token_secret
    });
  },
  stream: function() {
    this.API.stream('filter', {'locations': '-180,-90,180,90'}, function(stream) {
      this.database_controller.removeDeprecatedCounts();
      stream.on('data', function(data) {
        this.globe_controller.extractCoordinates(data);
        this.database_controller.extractHashtags(data);
      }.bind(this));
    }.bind(this));
  }
}

function GlobeController() {
  // this.view = new GlobeView;
}

GlobeController.prototype = {
  extractCoordinates: function(tweet) {
    if (tweet.coordinates) {
      return tweet.coordinates.coordinates;
    }
  }
}

function DatabaseController() {}

DatabaseController.prototype = {
  removeDeprecatedCounts: function() {
    setInterval(function() {
      db.collection('counts').remove({value: 1});
    }, HOUR);
  },
  removeDeprecatedTweets: function() {
    db.collection('hashtags').remove({timestamp: {"$lt": Date.now() - DAY}})
  },
  extractHashtags: function(tweet) {
    if (tweet.entities && tweet.entities.hashtags.length > 0) {
      this.storeHashtags(tweet);
    }
  },
  storeHashtags: function(tweet) {
    for (var i = 0; i < tweet.entities.hashtags.length; i++) {
      db.collection('hashtags').insert({created_at: tweet.created_at,
        hashtag: tweet.entities.hashtags[i].text, timestamp: Date.parse(tweet.created_at)};
      this.updateCounts(tweet.entities.hashtags[i]);
    }
    this.removeDeprecatedTweets();
  },
  updateCounts: function(hashtag) {
    function map() {emit(this.hashtag, 1)}
    function reduce(key, values) {return Array.sum(values)}
    db.collection('hashtags').mapReduce(map, reduce, {
      query: {hashtag: hashtag.text},
      out: {merge: "counts"}
    });
  }
}


// var dbController = (function(view, model){
//   // Remove hashtags where count = 1 every hour
//   setInterval(removeOldHashtagCounts, HOUR)

//   function removeOldHashtagCounts(){
//     db.collection('hashtagCount').remove({ value: 1 })
//   }

//   return {
//     view: view,
//     model: model,
//     parseRawTweet: function(io, tweet){
//       var timestamp = tweet.created_at;


//       if (tweet.entities && tweet.entities.hashtags.length > 0) {
//         tweet.entities.hashtags.forEach(function(tag) {
//           db.collection('tweets').insert( {created_at: timestamp, hashtag: tag.text, timestamp: Date.parse(timestamp) } );

//           function map() { emit( this.hashtag, 1 ) }
//           function reduce(key, values) { return Array.sum(values) }
//           function finalize(key, value) { return { value: value, time: Date.now() } }

//         db.collection('tweets').mapReduce(map, reduce, {
//                         query: { hashtag: tag.text },
//                         out: { merge: "hashtagCount" }
//                         // finalize: finalize
//                         });
//         // Remove tweets that came in more than 24 hours ago
//         db.collection('tweets').remove( { timestamp: { "$lt": Date.now() - DAY } } )

//         // DO NOT DELETE - find the top 5 most used hashtags in database
//         // db.hashtagCount.find( { $query: {}, $orderby: { value: -1 } } ).limit(5)
//         });
//       }
//     }
//   }

// })(dbView, dbModel);

