var Twitter = require('twitter'),
    mongojs = require('mongojs');
var consumer_key = process.env.CONSUMER_KEY,
    consumer_secret = process.env.CONSUMER_SECRET,
    access_token_key = process.env.ACCESS_TOKEN_KEY,
    access_token_secret = process.env.ACCESS_TOKEN_SECRET;
var dbuser = process.env.DBUSER,
    dbpass = process.env.DBPASSWORD,
    db = mongojs('mongodb://'+dbuser+':'+dbpass+'@ds059908.mongolab.com:59908/livedata');
var MS_HOUR = 3600000,
    MS_DAY = 86400000,
    MS_SECOND = 1000;

module.exports = function(io) {
  var master_controller = new MasterController(io);
  master_controller.connect()
  db.collection('tweets').createIndex({ 'hashtag': 1 })
  master_controller.stream()
}

function MasterController(io) {
  this.API = null;
  this.globe_controller = new GlobeController(io);
  this.database_controller = new DatabaseController(io);
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
      this.database_controller.calculateTopFiveHashtags();
      stream.on('data', function(data) {
        this.globe_controller.extractCoordinates(data);
        this.globe_controller.extractHashtags(data);
        this.database_controller.extractHashtags(data);
      }.bind(this));
    }.bind(this));
  }
}

function GlobeController(io) {
  this.view = new GlobeView(io);
}

GlobeController.prototype = {
  extractCoordinates: function(tweet) {
    if (tweet.coordinates) {
      //this.view.chartCoordinates(tweet.coordinates.coordinates);
      this.view.chartCoordinates(tweet);
    }
  },
  extractHashtags: function(tweet) {
    if (tweet.entities) {
      this.view.sendHashtagCount(tweet.entities.hashtags.length);
    }
  }
}

function GlobeView(io) {
  this.io = io;
}

GlobeView.prototype = {
  chartCoordinates: function(coordinates) {
    // chart coordinates on globe
    this.io.sockets.emit('newGlobeTweet', coordinates.coordinates.coordinates);
  },
  sendHashtagCount: function(count) {
    // send hashtag count to globe
    this.io.sockets.emit('newHashtag', count);
  }
}

function DatabaseController(io) {
  this.line_graph_view = new LineGraphView(io);
}

DatabaseController.prototype = {
  removeDeprecatedCounts: function() {
    setInterval(function() {
      db.collection('hashtagCount').remove({value: 1});
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
      db.collection('tweets').insert({created_at: tweet.created_at,
                                        hashtag: tweet.entities.hashtags[i].text,
                                        timestamp: Date.parse(tweet.created_at)});
      this.updateCounts(tweet.entities.hashtags[i]);
    }
    this.removeDeprecatedHashtags();
  },
  updateCounts: function(hashtag) {
    function map() {emit(this.hashtag, 1)}
    function reduce(key, values) {return Array.sum(values)}
    db.collection('tweets').mapReduce(map, reduce, {
      query: {hashtag: hashtag.text},
      out: {merge: "hashtagCount"}
    });
  },

  calculateTopFiveHashtags: function() {
    setInterval(function() {
      var query = db.collection('hashtagCount').find({}).sort({value: -1}).limit(5)
      query.toArray(function(error, topFiveHashtagCounts){
        this.line_graph_view.draw(topFiveHashtagCounts);
      }.bind(this));
    }.bind(this), MS_SECOND);

  }
}

function LineGraphView(io) {
  this.io = io;
}

LineGraphView.prototype = {
  draw: function(topHashtagCounts) {
    this.io.sockets.emit('new count', topHashtagCounts);
  }
}
