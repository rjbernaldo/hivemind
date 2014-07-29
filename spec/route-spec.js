var request = require('request'),
    mongojs = require('mongojs'),
    db = mongojs("test"),
    controllers = ('../mainController.js');

describe('routes', function() {
  describe('index', function() {
    it("responds with okay status", function() {
      request("http://localhost:3000", function(error, response){
        expect(response.statusCode).toEqual(200);
      });
    });
  });
  describe('chart', function() {
    it("responds with okay status", function() {
      request("http://localhost:3000/hashtags", function(error, response){
        expect(response.statusCode).toEqual(200);
      });
    });
  });
})
