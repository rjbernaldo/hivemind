var Twitter = require('twitter'),
    consumer_key = process.env.CONSUMER_KEY,
    consumer_secret = process.env.CONSUMER_SECRET,
    access_token_key = process.env.ACCESS_TOKEN_KEY,
    access_token_secret = process.env.ACCESS_TOKEN_SECRET;
var dbuser = process.env.DBUSER,
    dbpass = process.env.DBPASSWORD,
    mongojs = require('mongojs'),
    db = mongojs('mongodb://' + dbuser + ':' + dbpass + '@ds059908.mongolab.com:59908/livedata');
var GlobeController = require('./globe_controller'),
    DatabaseController = require('./database_controller');

module.exports = function(io) {
  var master_controller = new MasterController(io);
  master_controller.connect();
  db.collection('hashtags').createIndex({ 'hashtag': 1 });
  db.collection('hashtags').createIndex({ 'timestamp': 1 });
  db.collection('counts').createIndex({ 'value': -1} );
  master_controller.stream();
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
      stream.on('data', function(data) {
        this.globe_controller.extractCoordinates(data);
        this.globe_controller.extractHashtags(data);
        this.database_controller.extractHashtags(data);
        this.database_controller.calculateTopFiveHashtags();
      }.bind(this));
    }.bind(this));
  }
}
