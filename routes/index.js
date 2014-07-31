var express = require('express'),
    router = express.Router(),
    path = require('path');

router.get('/', function(request, response) {
  var globeIndex = path.join(__dirname, '../views/index.html');
  response.sendfile(globeIndex);
});

router.get('/hashtag', function(request, response) {
  response.render('canvas');
})

router.get('/hashtag-new', function(request, response) {
  response.render('hashtag');
})

module.exports = router;
