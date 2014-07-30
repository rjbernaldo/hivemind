var Twitter = require('twitter'),
    consumer_key = process.env.CONSUMER_KEY,
    consumer_secret = process.env.CONSUMER_SECRET,
    access_token_key = process.env.ACCESS_TOKEN_KEY,
    access_token_secret = process.env.ACCESS_TOKEN_SECRET;
var GlobeController = require('./globe_controller'),
    LineGraphController = require('./line_graph_controller'),
    Database = require('../models/database');

function MasterController(io) {
  this.API = new Twitter({
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
    access_token_key: access_token_key,
    access_token_secret: access_token_secret
  });
  this.globe_controller = new GlobeController(io);
  this.line_graph_controller = new LineGraphController(io);
  this.database = new Database;
}
MasterController.prototype = {
  stream: function() {
    this.setupDatabase();
    this.API.stream('filter', {'locations': '-180,-90,180,90'}, function(stream) {
      stream.on('data', function(data) {
        this.database.store(data);
        this.line_graph_controller.topFiveHashtags(this.database);
        this.globe_controller.chartCoordinates(data);
        this.globe_controller.sendHashtagTotal(data);
      }.bind(this));
    }.bind(this));
  },
  setupDatabase: function() {
    this.database.setupIndicies();
    this.database.garbageCollection();
  }
}

module.exports = function(io) {
  var master_controller = new MasterController(io);
  master_controller.stream();
}
