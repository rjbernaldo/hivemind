function TweetParser() {}
TweetParser.prototype = {
  extractHashtags: function(tweet) {
    if (tweet.entities && tweet.entities.hashtags.length > 0) {
      return tweet.entities.hashtags;
    } else {
      return []
    }
  },
  extractCoordinates: function(tweet) {
    if (tweet.coordinates) {
      return tweet.coordinates.coordinates;
    }
  }
}

module.exports = TweetParser;
