var UI = {};
UI.TweetCount = (function() {
  var tweetCounter = 0;

  function counterCount() {
    return tweetCounter++;
  }

  return {
    update: function() {
      var currentCount = counterCount();
      UI.View.updateTweetCount(currentCount);
    }
  }
})();

UI.SessionTimer = (function(){

  return {
    update:function(count) {
      UI.View.updateTimeCount(count)
    }
  }
})();

UI.HashtagCount = (function() {
  var hashtagCounter = 0;

  function counterCount(data) {
    return hashtagCounter += data;
  }

  return {
    update:function(data) {
      var currentCount = counterCount(data);
      UI.View.updateHashtagCount(currentCount);
    }

  }
})();

UI.View = (function() {
  var tweetCountDom = document.getElementsByClassName('tweetCount');
  var hashtagCountDom = document.getElementsByClassName('hashtagCount');
  var tweetTimeCountDom = document.getElementsByClassName('tweetCountDescription')
  // var countryCountDom = document.getElementsByClassName('something');

  function animateDescription() {
    $('#watching').toggle(
      function(){
        $('#what').addClass('flipOutX')
        $('#what').css('display','none')
        $('#explanation').css('display','block')
        $('#explanation').removeClass('flipOutX')
        $('#explanation').addClass('flipInX')        
        },
      function(){
        $('#explanation').removeClass('flipInX')
        $('#explanation').addClass('flipOutX')
        setTimeout(function(){
          $('#what').css('display','block')
          $('#what').removeClass('flipOutX')
          $('#what').addClass('flipInX')
        }, 500)
      }
    )
  }

  function hoverTweetCount() {
    $('.tweetCountContainer').hover(
      function() {
        $('.tweetCountDescription').css('display','block')
        $('.tweetCountDescription').removeClass('flipOutX')
        $('.tweetCountDescription').addClass('flipInX')
      },
      function() {
        $('.tweetCountDescription').removeClass('flipInX')
        $('.tweetCountDescription').addClass('flipOutX')
        setTimeout(function(){
          $('.tweetCountDescription').css('display','none')
        }, 500)
      }
    )
  }

  function hoverHashtagCount() {
    $('.hashtagCountContainer').hover(
      function() {
        $('.hashtagCountDescription').css('display','block')
        $('.hashtagCountDescription').removeClass('flipOutX')
        $('.hashtagCountDescription').addClass('flipInX')
      },
      function() {
        $('.hashtagCountDescription').removeClass('flipInX')
        $('.hashtagCountDescription').addClass('flipOutX')
        setTimeout(function(){
          $('.hashtagCountDescription').css('display','none')
        }, 500)
      }
    )
  }

  return {
    init: function() {
      animateDescription();
      hoverHashtagCount();
      hoverTweetCount();
      // initializeCountryCount();
    },
    updateTweetCount: function(count) {
      tweetCountDom[0].innerHTML = count;
    },
    updateHashtagCount: function(data) {
      hashtagCountDom[0].innerHTML = data
    },
    updateTimeCount: function(count) {
      tweetTimeCountDom[0].innerHTML = 'The amount of tweets streamed in the last ' + count + ' seconds.'
    }
  }
})();

UI.View.init();
