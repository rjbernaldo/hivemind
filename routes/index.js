var express = require('express'),
    router = express.Router(),
    path = require('path');

router.get('/', function(request, response) {
  var globeIndex = path.join(__dirname, '../views/index.html');
  response.sendfile(globeIndex);
});

router.get('/hashtag', function(request, response) {
  response.render('hashtag');
})

router.get('/sherwood', function(request, response) {
  var sherwood = path.join(__dirname, '../views/sherwood.html');
  response.sendfile(sherwood);
})

module.exports = router;
