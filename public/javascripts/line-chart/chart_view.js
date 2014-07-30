function ChartView(){

}

ChartView.prototype = {
  renderChart: function(chartObj){
    var chart = new CanvasJS.Chart("chartContainer", chartObj)
    chart.render()
  }
}

// module.exports = chartView
