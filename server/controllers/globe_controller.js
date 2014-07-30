var GlobeView = require('../views/globe_view'),
    TweetParser = require('../models/tweet_parser');

function GlobeController(io) {this.globe_view = new GlobeView(io);}
GlobeController.prototype = {
  chartCoordinates: function(tweet) {
    var coordinates = (new TweetParser).extractCoordinates(tweet);
    if (coordinates) {
      this.globe_view.chartCoordinates(coordinates);
    }
  },
  sendHashtagTotal: function(tweet) {
    var hashtags = (new TweetParser).extractHashtags(tweet);
    this.globe_view.sendHashtagTotal(hashtags.length);
  }
}

module.exports = GlobeController;
