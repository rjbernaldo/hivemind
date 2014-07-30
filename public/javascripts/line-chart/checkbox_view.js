function CheckBoxView(){

}

CheckBoxView.prototype = {
  populateCheckBoxes: function(data){
    for (var i = 0; i < 6; i++){
      $('#checkbox-list').children().find(eval('label'+i)).text(data[i]._id);
    }
  },
  makeCheckBoxesClickable: function(chart){
    for(var i = 0; i < 6; i++){
      (function(i){
        $('#checkbox-list').find(eval('box'+i)).on('click', function(){
          console.log(event.target)
          chart.data[i].visible^=true
        })
      })(i);
    }
  }
}


// module.exports = CheckboxView
