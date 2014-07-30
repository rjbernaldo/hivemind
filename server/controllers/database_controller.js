var dbuser = process.env.DBUSER,
    dbpass = process.env.DBPASSWORD,
    mongojs = require('mongojs'),
    // db = mongojs('mongodb://' + dbuser + ':' + dbpass + '@ds059908.mongolab.com:59908/livedata');
    db = mongojs('tweets')
var MS_HOUR = 3600000,
    MS_DAY = 86400000;
var LineGraphView = require('../views/line_graph_view');

function DatabaseController(io) {this.line_graph_view = new LineGraphView(io);}
DatabaseController.prototype = {
  removeDeprecatedCounts: function() {
    setInterval(function() {
      db.collection('counts').remove({value: 1});
    }, MS_HOUR);
  },
  removeDeprecatedHashtags: function() {
    db.collection('hashtags').remove({timestamp: {"$lt": Date.now() - MS_DAY}})
  },
  extractHashtags: function(tweet) {
    if (tweet.entities && tweet.entities.hashtags.length > 0) {
      this.storeHashtags(tweet);
    }
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
  calculateTopFiveHashtags: function() {
    var query = db.collection('counts').find({}).sort({value: -1}).limit(5)
    query.toArray(function(error, topFiveHashtagCounts){
      this.line_graph_view.draw(topFiveHashtagCounts);
    }.bind(this));
  }
}

module.exports = DatabaseController;
