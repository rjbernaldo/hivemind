var GlobeView = require('../views/globe_view')

function GlobeController(io) {this.view = new GlobeView(io);}
GlobeController.prototype = {
  extractCoordinates: function(tweet) {
    if (tweet.coordinates) {
      this.view.chartCoordinates(tweet.coordinates.coordinates);
    }
  },
  extractHashtags: function(tweet) {
    if (tweet.entities) {
      this.view.sendHashtagCount(tweet.entities.hashtags.length);
    }
  }
}

module.exports = GlobeController;
