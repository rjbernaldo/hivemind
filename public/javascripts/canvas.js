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
  var dataLength = 500; // number of dataPoints visible at any point
  populateTagList(socket);
  populateCheckBoxes(socket);
  makeBoxesClickable();
  makeTagsClickable();

  chart = new CanvasJS.Chart("chartContainer",{
    title :{
      text: "Live Random Data"
    },
    data: [
      {
        type: "line",
        dataPoints: series1,
        visible: true
      },
      {
        type: "line",
        dataPoints: series2,
        visible: true
      },
      {
        type: "line",
        dataPoints: series3,
        visible: true
      },
      {
        type: "line",
        dataPoints: series4,
        visible: true
      },
      {
        type: "line",
        dataPoints: series5,
        visible: true
      }
    ],
    axisY: {
      minimum: 0,
      maximum: 1000,
      interval: 100

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
          y: holder[holder.length-1][i-1].value
        })
      })(i)
    }
    xVal++
  }, 20)

  var updateChart = function (count) {
    if (holder.length > dataLength){
      holder.shift();
    }

    setYAxis();
    checkVisible();

    chart.render();

  };

  setInterval(function(){updateChart()}, updateInterval);

}

function populateTagList(socket){
  socket.on('new count', function(data){
    for (var i = 0; i < data.length; i++){
      $($('#tag-list').children()[i]).text(data[i]._id)
    }
  })
}

function checkVisible(){
  for(var i = 0; i < 5; i++){
    (function(i){
      if ($('#checkbox-list').find(eval('#box'+i)).prop('checked') = true){
        chart.options.data[i].visible^=true
      }
    })(i)
  }
}

function populateCheckBoxes(socket){
  socket.on('new count', function(data){
    for (var i = 0; i < data.length; i++){
      $('#checkbox-list').children().find(eval('label'+i)).text(data[i]._id);
    }
  })
}

function makeTagsClickable(){
  for(var i = 0; i < 5; i++){
    (function(i){
      $(eval("tag"+i)).on('click', function(){
        chart.options.data[i].visible^=true
      })
    })(i)
  }
}

function makeBoxesClickable(){
  for(var i = 0; i < 5; i++){
    (function(i){
      $($('#checkbox-list').children()[i]).on('click', function(){
        console.log(event.target)
      })
    })(i)
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

  chart.options.axisY.minimum = Math.min.apply(Math, defaults)-10
  chart.options.axisY.maximum = Math.max.apply(Math, defaults)+10
  chart.options.axisY.interval = parseInt((chart.options.axisY.maximum-chart.options.axisY.minimum)/4)

}

