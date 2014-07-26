var Canvas = function() {
  this.context = document.getElementsByTagName("canvas")[0].getContext("2d");
  this.last_visited = [0, 0];
}

Canvas.prototype = {
  draw: function(coordinates) {
    this.context.moveTo(coordinates["start"][0], coordinates["start"][1]);
    this.context.lineTo(coordinates["end"][0], coordinates["end"][1]);
    this.context.stroke();
    this.last_visited = coordinates["end"];
  }
}