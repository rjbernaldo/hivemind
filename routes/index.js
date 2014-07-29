var express = require('express'),
    router = express.Router(),
    path = require('path');

router.get('/', function(request, response) {
  var globeIndex = path.join(__dirname, '../views/index.html');
  response.sendfile(globeIndex);
});

<<<<<<< HEAD
router.get('/canvas', function(req, res){
  res.render('canvas');
})

router.get('/hashtag', function(req, res) {
  res.render('mychart');
=======
router.get('/hashtag', function(request, response) {
  response.render('mychart');
>>>>>>> master
})

module.exports = router;
