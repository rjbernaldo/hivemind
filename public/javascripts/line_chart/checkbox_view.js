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
        $('.label'+i).on('click', function(){
          // $('#checkbox-list').children().find(eval('label'+i)).on
          chart.data[i].visible^=true;
        })
      })(i);
    }
  },
  makeCheckBoxesToggleable: function(){
    $('.hashtag-label').on('click', function(event){
      $(this).toggleClass("faded");
    })
  }
}
