// var dbuser = process.env.DBUSER,
//     dbpass = process.env.DBPASSWORD,
//     mongojs = require('mongojs'),
//     db = mongojs(process.env.DATABASE);
// var MS_HOUR = 3600000,
//     MS_DAY = 86400000;
// var TweetParser = require('./tweet_parser');
var config = require('../config');

function Database() {}
Database.prototype = {
  setupIndicies: function() {
    config.db.collection('hashtags').createIndex({'hashtag': 1});
    config.db.collection('hashtags').createIndex({'timestamp': 1});
    config.db.collection('counts').createIndex({'value': -1});
  },
  garbageCollection: function() {
    setInterval(function() {
      config.db.collection('counts').remove({value: 1});
    }, config.MS_HOUR);
  },
  removeDeprecated: function() {
    config.db.collection('hashtags').remove({timestamp: {"$lt": Date.now() - config.MS_DAY}})
  },
  store: function(tweet) {
    var hashtags = (new TweetParser).extractHashtags(tweet);
    for (var i = 0; i < hashtags.length; i++) {
      config.db.collection('hashtags').insert({created_at: tweet.created_at,
                                        hashtag: hashtags[i].text,
                                        timestamp: Date.parse(tweet.created_at)});
      this.recount(hashtags[i]);
    }
    this.removeDeprecated();
  },
  recount: function(hashtag) {
    function map() {emit(this.hashtag, 1)}
    function reduce(key, values) {return Array.sum(values)}
    config.db.collection('hashtags').mapReduce(map, reduce, {
      query: {hashtag: hashtag.text},
      out: {merge: "counts"}
    });
  },
  topFiveHashtags: function(controller) {
    var cursor = config.db.collection('counts').find({}).sort({value: -1}).limit(5);
    cursor.toArray(function(error, topFive) {
      controller.line_graph_view.update(topFive);
    });
  }
}

module.exports = Database;
