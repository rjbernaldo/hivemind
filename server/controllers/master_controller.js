var Twitter = require('twitter'),
    consumer_key = process.env.CONSUMER_KEY,
    consumer_secret = process.env.CONSUMER_SECRET,
    access_token_key = process.env.ACCESS_TOKEN_KEY,
    access_token_secret = process.env.ACCESS_TOKEN_SECRET;
var GlobeController = require('./globe_controller'),
    DatabaseController = require('./database_controller');

function MasterController(io) {
  this.API = new Twitter({
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
    access_token_key: access_token_key,
    access_token_secret: access_token_secret
  });
  this.globe_controller = new GlobeController(io);
  this.database_controller = new DatabaseController(io);
}
MasterController.prototype = {
  stream: function() {
    this.API.stream('filter', {'locations': '-180,-90,180,90'}, function(stream) {
      this.database_controller.setupDatabase();
      stream.on('data', function(data) {
        this.database_controller.passTweetToDatabase(data);
        this.database_controller.passTopHashtagCountsToLineGraph();
        this.globe_controller.extractCoordinatesFromTweet(data);
        this.globe_controller.extractHashtagsFromTweet(data);
      }.bind(this));
    }.bind(this));
  }
}

module.exports = function(io) {
  var master_controller = new MasterController(io);
  master_controller.stream();
}