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
  var timeCounter = 0;
  
  function sessionTimer() {
    setInterval(function () {
      ++timeCounter;
    }, 1000);
    return timeCounter
  }

  return {
    update:function() {
      var secondsCount = sessionTimer();
      UI.View.updateTimeCount(secondsCount)
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

  return {
    init: function() {
      animateDescription();
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
