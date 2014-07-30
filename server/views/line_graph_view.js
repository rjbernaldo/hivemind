function LineGraphView(io) {this.io = io;}
LineGraphView.prototype = {
  draw: function(topHashtagCounts) {
    this.io.sockets.emit('new count', topHashtagCounts);
  }
}

module.exports = LineGraphView;
