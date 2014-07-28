$(document).ready(function(){
  var socket = io.connect('http://localhost')
  drawChart(socket);
  populateTagList(socket);
});

function drawChart(socket){
  $('#chart').highcharts({
    chart: {
      type: 'line',
      animation: Highcharts.svg,
      marginRight: 10,
      events: {
        load: function() {
          socket.on('new count', function(data){
            for (var i = 0; i < data.length; i++) {
              var x = (new Date).getTime(),
                  y = data[i].value;
              this.series[i].name = data[i]._id;
              this.series[i].addPoint([x, y], true, false);
            }
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