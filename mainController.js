var Twitter = require('twitter'),
    mongojs = require('mongojs')
var consumer_key = process.env.CONSUMER_KEY,
    consumer_secret = process.env.CONSUMER_SECRET,
    access_token_key = process.env.ACCESS_TOKEN_KEY,
    access_token_secret = process.env.ACCESS_TOKEN_SECRET
var dbuser = process.env.DBUSER,
    dbpass = process.env.DBPASSWORD,
    db = mongojs('mongodb://'+dbuser+':'+dbpass+'@ds059908.mongolab.com:59908/livedata')
var MS_HOUR = 3600000,
    MS_DAY = 86400000;
var io;

module.exports = function(io) {
  io = io;
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
  this.view = new GlobeView;
}

GlobeController.prototype = {
  extractCoordinates: function(tweet) {
    if (tweet.coordinates) {
      this.view.chartCoordinates(tweet.coordinates.coordinates);
    }
  }
}

function GlobeView() {}

GlobeView.prototype = {
  chartCoordinates: function(coordinates) {
    // chart coordinates on globe
  }
}

function DatabaseController() {
  this.line_graph_view = new LineGraphView;
}

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
  }
}

function LineGraphView() {}

LineGraphView.prototype = {
  draw: function() {
   // draw line graph
  }
}
