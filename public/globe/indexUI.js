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
  // var countryCountDom = document.getElementsByClassName('something');


  function initializeTweetCount() {
    var containerDiv = document.createElement('div');
    var countDiv = document.createElement('div');
    var textDiv = document.createElement('div');
    var link = document.createElement('a');

    containerDiv.className = 'tweetCountContainer'
    // containerDiv.style.position = 'absolute';
    // containerDiv.style.left = '20px';
    // containerDiv.style.top = '20px';

    countDiv.className = 'tweetCount';
    // countDiv.style.fontFamily = 'Georgia';
    // countDiv.style.fontSize = '40px'
    // countDiv.style.marginBottom = '15px'

    textDiv.className = "tweetCountText"
    textDiv.innerHTML = 'TWEETS';

    containerDiv.appendChild(countDiv);
    containerDiv.appendChild(textDiv);

    link.appendChild(containerDiv);
    link.href = "#";
    document.body.appendChild(link);
  }

  function initializeHashtagCount() {
    var containerDiv = document.createElement('div');
    var countDiv = document.createElement('div');
    var textDiv = document.createElement('div');
    var link = document.createElement('a');

    containerDiv.className = 'hashtagCountContainer'
    containerDiv.style.position = 'absolute';
    containerDiv.style.right = '20px';
    containerDiv.style.top = '20px';
    containerDiv.style.textAlign = 'left';

    countDiv.className = 'hashtagCount';
    countDiv.style.fontFamily = 'Georgia';
    countDiv.style.fontSize = '40px'
    countDiv.style.marginBottom = '15px'

    textDiv.className = "hastagCountText"
    textDiv.innerHTML = 'HASHTAGS';
    textDiv.style.textAlign = 'right'

    containerDiv.appendChild(countDiv);
    containerDiv.appendChild(textDiv);

    link.appendChild(containerDiv);
    link.href = "hashtag";
    document.body.appendChild(link);
  }

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
        $('#what').css('display','block')
        $('#what').removeClass('flipOutX')
        $('#what').addClass('flipInX')
      }
    )
  }

  return {
    init: function() {
      initializeTweetCount();
      initializeHashtagCount();
      animateDescription();
      // initializeCountryCount();
    },
    updateTweetCount: function(count) {
      tweetCountDom[0].innerHTML = count;
    },
    updateHashtagCount: function(data) {
      hashtagCountDom[0].innerHTML = data
    }
  }
})();

UI.View.init();
