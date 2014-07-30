// var LineGraphView = require('../views/line_graph_view'),
//     Database = require('../models/database');

var config = require('../config');

function LineGraphController(io) {
  this.line_graph_view = new config.LineGraphView(io);
}
LineGraphController.prototype = {
  topFiveHashtags: function(database) {
    database.topFiveHashtags(this);
  }
}

module.exports = LineGraphController;
