var LineGraphView = require('../views/line_graph_view'),
    Database = require('../models/database');

function DatabaseController(io) {
  this.line_graph_view = new LineGraphView(io);
  this.database = new Database;
}
DatabaseController.prototype = {
  setupDatabase: function() {
    this.database.setupIndicies();
    this.database.removeDeprecatedCounts();
  },
  passTweetToDatabase: function(tweet) {
    this.database.extractHashtagsFromTweet(tweet);
  },
  passTopHashtagCountsToLineGraph: function() {
    var topFiveHashtagCounts = this.database.calculateTopFiveHashtags();
    this.line_graph_view.update(topFiveHashtagCounts);
  }
}

module.exports = DatabaseController;
