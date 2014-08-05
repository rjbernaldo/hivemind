var dbuser = process.env.DBUSER,
    dbpass = process.env.DBPASSWORD,
    mongojs = require('mongojs'),
    db = mongojs(process.env.DATABASE);
var MS_HOUR = 3600000,
    MS_DAY = 86400000;
var TweetParser = require('./tweet_parser');

function Database() {}

Database.prototype = {
  setupIndicies: function() {
    db.collection('hashtags').createIndex({'hashtag': 1});
    db.collection('hashtags').createIndex({'timestamp': 1});
    db.collection('counts').createIndex({'value': -1});
  },
  garbageCollection: function() {
    setInterval(function() {
      db.collection('counts').remove({value: 1});
      db.repairDatabase();
    }, MS_HOUR);
  },
  removeDeprecated: function() {
    db.collection('hashtags').remove({timestamp: {"$lt": Date.now() - MS_DAY}})
  },
  store: function(tweet) {
    var hashtags = (new TweetParser).extractHashtags(tweet);
    for (var i = 0; i < hashtags.length; i++) {
      db.collection('hashtags').insert({created_at: tweet.created_at,
                                        hashtag: hashtags[i].text,
                                        timestamp: Date.parse(tweet.created_at)});
      this.recount(hashtags[i]);
    }
    this.removeDeprecated();
  },

  recount: function(hashtag) {
    function map() {emit(this.hashtag, 1)}
    function reduce(key, values) {return Array.sum(values)}
    db.collection('hashtags').mapReduce(map, reduce, {
      query: {hashtag: hashtag.text},
      out: {merge: "counts"}
    });
  },

  topFiveHashtags: function(controller) {
    var cursor = db.collection('counts').find({}).sort({value: -1}).limit(6);
    cursor.toArray(function(error, topFive) {
      controller.line_graph_view.update(topFive);
    });
  }
}

module.exports = Database;
