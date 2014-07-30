function LineGraphView(io) {this.io = io;}
LineGraphView.prototype = {
  update: function(topHashtagCounts) {
    this.io.sockets.emit('new count', topHashtagCounts);
  }
}

module.exports = LineGraphView;
