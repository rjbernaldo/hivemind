var LineGraphView = require('../views/line_graph_view'),
    Database = require('../models/database');

function LineGraphController(io) {
  this.line_graph_view = new LineGraphView(io);
}
LineGraphController.prototype = {
  topFiveHashtags: function(database) {
    database.topFiveHashtags(this);
  }
}

module.exports = LineGraphController;
