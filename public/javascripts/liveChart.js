$(document).ready(function(){
  var socket = io.connect('http://localhost')
  drawChart(socket, 0);
  populateTagList(socket);
  makeTagsClickable(socket);
});

function drawChart(socket, pos){
  $('#chart').highcharts({
    chart: {
      type: 'line',
      animation: Highcharts.svg,
      marginRight: 10,
      events: {
        load: function() {
          socket.on('new count', function(data){
            var x = (new Date).getTime(),
                y = data[pos].value;
            this.series[0].name = data[pos]._id;
            this.series[0].addPoint([x, y], true, false);
          }.bind(this));
        }
      }
    },
    title: {text: 'Top Hashtags'},
    xAxis: {
      title: {text: 'Coordinated Universal Time'},
      type: 'datetime',
      tickInterval: 10000
    },
    yAxis: {
      title: {text: 'Frequency of Occurence'},
      plotLines: [{
        value: 0,
        width: 10,
        color: '#808080'
      }],
      tickInterval: 2
    },
    tooltip: {
      formatter: function() {
        return '<b>#' + this.series.name + '</b><br/>' +
                Highcharts.numberFormat(this.y, 0);
      }
    },
    legend: {enabled: false},
    exporting: {enabled: false},
    series: [{
      data: [],
      visible: true,
      marker: {enabled: false}
    }, {
      data: [],
      visible: false,
      marker: {enabled: false}
    }, {
      data: [],
      visible: false,
      marker: {enabled: false}
    }, {
      data: [],
      visible: false,
      marker: {enabled: false}
    }, {
      data: [],
      visible: false,
      marker: {enabled: false}
    }]
  });
};

function populateTagList(socket){
  socket.on('new count', function(data){
    for (var i = 0; i < data.length; i++){
      $($('#tag-list').children()[i]).text(data[i]._id)
    }
  })
}

function makeTagsClickable(socket){
  $('#tag2').on('click', function(){
    // $("#chart").highcharts().series[0].visible=false;
    // $("#chart").highcharts().series[2].visible=true;
    $('#chart').remove();
    $('#chart-container').append("<div id='chart'></div>")
    drawChart(socket, 2);
  })
}

