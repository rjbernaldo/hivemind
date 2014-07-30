var dbuser = process.env.DBUSER,
    dbpass = process.env.DBPASSWORD,
    mongojs = require('mongojs'),
    db = mongojs(process.env.DATABASE);
var MS_HOUR = 3600000,
    MS_DAY = 86400000;

function Database() {}

Database.prototype = {
  extractHashtagsFromTweet: function(tweet) {
    if (tweet.entities && tweet.entities.hashtags.length > 0) {
      this.storeHashtags(tweet);
    }
  },
  setupIndicies: function() {
    db.collection('hashtags').createIndex({'hashtag': 1});
    db.collection('hashtags').createIndex({'timestamp': 1});
    db.collection('counts').createIndex({'value': -1});
  },
  removeDeprecatedCounts: function() {
    setInterval(function() {
      db.collection('counts').remove({value: 1});
    }, MS_HOUR);
  },
  removeDeprecatedHashtags: function() {
    db.collection('hashtags').remove({timestamp: {"$lt": Date.now() - MS_DAY}})
  },
  storeHashtags: function(tweet) {
    for (var i = 0; i < tweet.entities.hashtags.length; i++) {
      db.collection('hashtags').insert({created_at: tweet.created_at,
                                        hashtag: tweet.entities.hashtags[i].text,
                                        timestamp: Date.parse(tweet.created_at)});
      this.updateCounts(tweet.entities.hashtags[i]);
    }
    this.removeDeprecatedHashtags();
  },
  updateCounts: function(hashtag) {
    function map() {emit(this.hashtag, 1)}
    function reduce(key, values) {return Array.sum(values)}
    db.collection('hashtags').mapReduce(map, reduce, {
      query: {hashtag: hashtag.text},
      out: {merge: "counts"}
    });
  },
  calculateTopFiveHashtags: function(controller) {
    var cursor = db.collection('counts').find({}).sort({value: -1}).limit(5);
    cursor.toArray(function(error, topFiveHashtagCounts) {
      controller.line_graph_view.update(topFiveHashtagCounts);
    });
  }
}

module.exports = Database;
