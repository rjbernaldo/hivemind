function GlobeView(io) {this.io = io;}
GlobeView.prototype = {
  chartCoordinates: function(coordinates) {
    this.io.sockets.emit('newGlobeTweet', coordinates);
  },
  sendHashtagCount: function(count) {
    this.io.sockets.emit('newHashtag', count);
  }
}

module.exports = GlobeView;
