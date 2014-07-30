window.onload = function () {

  var socket = io.connect('/')
  var holder = [] // array to hold data transmitted from socket
  series1 = []; // dataPoints
  series2 = []; // dataPoints
  series3 = []; // dataPoints
  series4 = []; // dataPoints
  series5 = []; // dataPoints
  var xVal = 0; // counter to start x-axis values
  var updateInterval = 20; // how often data is pushed to series arrays (milliseconds)
  var dataLength = 200; // number of dataPoints visible at any point
  populateCheckBoxes(socket);
  makeCheckBoxesClickable();


  chart = new CanvasJS.Chart("chartContainer",{
    data: [
      {
        markerType: "none",
        type: "line",
        dataPoints: series1,
        visible: true
      },
      {
        markerType: "none",
        type: "line",
        dataPoints: series2,
        visible: true
      },
      {
        markerType: "none",
        type: "line",
        dataPoints: series3,
        visible: true
      },
      {
        markerType: "none",
        type: "line",
        dataPoints: series4,
        visible: true
      },
      {
        markerType: "none",
        type: "line",
        dataPoints: series5,
        visible: true
      }
    ],
    axisY: {
      minimum: 0,
      maximum: 1000,
      interval: 100
    },
    axisX: {
      minimum: 0,
      interval: 1
    },
    toolTip: {
      content: "#{name}<br>Number of Tweets: {y}"
    }
  });

  socket.on('new count', function(data){
    holder.push(data)
  })

  // loadDataPoints;
  setInterval(function(){
    for(var i = 1; i < 6; i++){
      (function(i){
        eval("series"+i).push({
          x: xVal,
          y: holder[holder.length-1][i-1].value,
          name: holder[0][i-1]._id
        })
      })(i)
    }
    xVal=xVal+0.02
  }, 20)

  var updateChart = function (count) {
    if (holder.length > dataLength){
      holder.shift();
    }

    setYAxis();
    limitPoints(dataLength);
    chart.render();

  };

  setInterval(function(){updateChart()}, updateInterval);

}

function populateCheckBoxes(socket){
  socket.on('new count', function(data){
    for (var i = 0; i < data.length; i++){
      $('#checkbox-list').children().find(eval('label'+i)).text(data[i]._id);
    }
  })
}

function makeCheckBoxesClickable(){
  for(var i = 0; i < 5; i++){
    (function(i){
      $('#checkbox-list').find(eval('box'+i)).on('click', function(){
        chart.options.data[i].visible^=true
      })
    })(i);
  }
}

function setYAxis(){
  var defaults = [];

  for (var i = 0; i < 5; i++){
    if(chart.options.data[i].visible){
      for (var j = 0; j < chart.options.data[i].dataPoints.length; j++){
        defaults.push(chart.options.data[i].dataPoints[j].y)
      }
    }
  }
  calculateYAxisValues(defaults)
}

function calculateYAxisValues(defaults){
  var visibleAxes = countVisibleAxes();
  if(visibleAxes === 5){
    chart.options.axisY.minimum = Math.max(0, Math.min.apply(Math, defaults)-1000)
    chart.options.axisY.maximum = Math.max.apply(Math, defaults)+1000
  }else if(visibleAxes > 1){
    chart.options.axisY.minimum = Math.max(0, Math.min.apply(Math, defaults)-100)
    chart.options.axisY.maximum = Math.max.apply(Math, defaults)+100
  }else{
    chart.options.axisY.minimum = Math.max(0, Math.min.apply(Math, defaults)-10)
    chart.options.axisY.maximum = Math.max.apply(Math, defaults)+10
  }
  chart.options.axisY.interval = parseInt((chart.options.axisY.maximum-chart.options.axisY.minimum)/4)
}

function countVisibleAxes(){
  var count = 0;
  for(var i=0; i < 5; i++){
    if(chart.options.data[i].visible){
      count++
    }
  }
  return count
}

function limitPoints(dataLength){
  firstSeries = chart.options.data[0].dataPoints
  minX = []

  if(firstSeries.length > dataLength){
    for (var i = 0; i < firstSeries.length; i++){
      minX.push((firstSeries[firstSeries.length-1].x)-(dataLength/50))
    }
    chart.options.axisX.minimum = Math.min.apply(Math, minX)
  }
}