var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Express' });
// });

router.get('/globe', function(req, res) {
  var globeIndex = path.join(__dirname, '../', 'globe/index.html');
  res.sendfile(globeIndex);
});

router.get('/', function(req, res) {
  var globeIndex = path.join(__dirname, '../', 'public/globe/index.html');
  res.sendfile(globeIndex);
});

router.get('/canvas', function(req, res){
  res.render('canvas');
})

router.get('/hashtag', function(req, res) {
  res.render('mychart');
})


module.exports = router;
