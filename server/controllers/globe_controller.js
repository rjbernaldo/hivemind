var GlobeView = require('../views/globe_view')

function GlobeController(io) {this.globe_view = new GlobeView(io);}
GlobeController.prototype = {
  extractCoordinatesFromTweet: function(tweet) {
    if (tweet.coordinates) {
      this.globe_view.chartCoordinates(tweet.coordinates.coordinates);
    }
  },
  extractHashtagsFromTweet: function(tweet) {
    if (tweet.entities) {
      this.globe_view.sendHashtagCount(tweet.entities.hashtags.length);
    }
  }
}

module.exports = GlobeController;
