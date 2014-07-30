window.onload = function(){
  socket = io.connect('/')
  var chartView = new ChartView;
  var checkBoxView = new CheckBoxView;
  var chartModel = new ChartModel;
  var chartController = new ChartController(chartView, checkBoxView, chartModel);
  chartController.init(socket);
}

function ChartController(chartView, checkBoxView, chartModel){
  this.chartView = chartView;
  this.checkBoxView = checkBoxView;
  this.chartModel = chartModel;
  this.updateInterval = 20;
  this.cleanInterval = 5000;
}

ChartController.prototype = {
  init: function(socket){
    this.bindEventListeners(socket);
    var updateInterval = this.updateInterval
    var chart = this.chartModel.chartObject
    this.checkBoxView.makeCheckBoxesClickable(chart);

    // set interval to clear old data
    setInterval(function(){
      this.chartModel.cleanHolder();
      this.chartModel.cleanSeries();
    }.bind(this), this.cleanInterval)

    // set interval to update data
    setInterval(function(){
      this.chartModel.populateSeries(updateInterval);
      this.chartModel.updateYAxis();
      this.chartModel.updateXAxis();
      var chartObject = this.chartModel.chartObject
      this.chartView.renderChart(chartObject)
    }.bind(this), updateInterval)
  },

  bindEventListeners: function(socket){
    var chart = this.chartModel.chartObject
    socket.on('new count', function(data){
      this.chartModel.streamToHolder(data)
      this.checkBoxView.populateCheckBoxes(data)
    }.bind(this));
  }
}

