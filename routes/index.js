var express = require('express'),
    router = express.Router(),
    path = require('path');

router.get('/', function(request, response) {
  var globeIndex = path.join(__dirname, '../', 'public/globe/index.html');
  response.sendfile(globeIndex);
});

router.get('/hashtag', function(request, response) {
  response.render('mychart');
})

module.exports = router;
