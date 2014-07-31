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
        $('#checkbox-list').children().find(eval('label'+i)).on('click', function(){
          chart.data[i].visible^=true
        })
      })(i);
    }
  },
  makeCheckBoxesToggleable: function(){
    // $('.hashtag-label').on('click', function(event){
    //   $(event.target).css('color', '#aaa')
    //   $($(event.target).parent()).css('color', '#aaa')
    // })
    $('.hashtag-label').on('click', function(event){
      // debugger
      $(this).toggleClass("faded");
      // $(this).
    })
  }
}
