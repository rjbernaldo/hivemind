var Twitter = require('twitter'),
    consumer_key = process.env.CONSUMER_KEY,
    consumer_secret = process.env.CONSUMER_SECRET,
    access_token_key = process.env.ACCESS_TOKEN_KEY,
    access_token_secret = process.env.ACCESS_TOKEN_SECRET;
var request = require('request'),
    mongojs = require('mongojs'),
    db = mongojs("test");
var GlobeController = require('../server/controllers/globe_controller'),
    DatabaseController = require('../server/controllers/database_controller');

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

describe('database controller', function() {
  describe('extractHashtags method', function() {
    beforeEach(function() {
      var database_controller = new DatabaseController;
    });
    it("calls storeHashtags method if the given tweet has hashtags", function() {
      var fake_tweet = {entities: {hashtags: ["hashtag1", "hashtag2", "hashtag3"]}};
      database_controller.extractHashtags(fake_tweet);
      expect(database_controller.storeHashtags).toHaveBeenCalled();
    });
    it("doesn't call storeHashtags method if the given tweet doesn't have hashtags", function() {
      var fake_tweet = {entities: {hashtags: []}};
      database_controller.extractHashtags(fake_tweet);
      expect(database_controller.storeHashtags).not.toHaveBeenCalled();
    });
  });
  describe('removeDeprecatedCounts method', function() {
    it("removes counts with a value of 1 from the database each hour", function() {

    });
  });
  describe('removeDeprecatedHashtags method', function() {
    it("removes hashtags older than 24 hours from the database", function() {

    });
  });
  describe('storeHashtags method', function() {
    it("stores each hashtag associated with a given tweet in the database", function() {

    });
    it("calls updateCounts method for each hashtag", function() {

    });
    it("calls removeDeprecatedHashtags method", function() {

    });
  });
  describe('updateCounts method', function() {
    it("??????", function() {

    });
  });
  describe('calculateTopFiveHashtags method', function() {
    it("successfully queries for the five most frequently occuring hashtags in the database", function() {

    });
    it("calls the draw method on the line_graph_view object", function() {

    });
  });
});