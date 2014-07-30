var Twitter = require('twitter'),
    consumer_key = process.env.CONSUMER_KEY,
    consumer_secret = process.env.CONSUMER_SECRET,
    access_token_key = process.env.ACCESS_TOKEN_KEY,
    access_token_secret = process.env.ACCESS_TOKEN_SECRET;
var request = require('request'),
    mongojs = require('mongojs'),
    db = mongojs("test");
var TweetParser = require('../server/models/tweet_parser');

describe('routes', function() {
  describe('globe and index page', function() {
    it("responds with okay status", function() {
      request("http://localhost:3000", function(error, response){
        expect(response.statusCode).toEqual(200);
      });
    });
  });
  describe('top hashtags chart', function() {
    it("responds with okay status", function() {
      request("http://localhost:3000/hashtags", function(error, response){
        expect(response.statusCode).toEqual(200);
      });
    });
  });
});

process.env.DATABASE = ""

describe('tweet parser model', function() {
  beforeEach(function() {

  });
  it("extracts hashtags from a given tweet", function() {

  });
  it("returns empty array if given tweet lacks hashtags", function() {

  });
  it("extracts coordinates from a given tweet", function() {

  });
});
