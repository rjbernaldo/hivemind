var dotenv = require('dotenv'),
    express = require('express'),
    path = require('path'),
    routes = require('./routes/index'),
    //newrelic = require('newrelic'),
    app = express();

// load environment
dotenv.load();

// set views path and engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// load static files (css, js)
app.use(express.static(path.join(__dirname, 'public')));

// load routes
app.use('/', routes);

if (app.get('env') === 'development') {
  // development error handler, shows stacktrace
  app.use(function(error, request, response, next) {
    response.status(error.status || 500);
    response.render("Sorry, but something's broken!",
      {message: error.message, error: error}
    );
  });
} else {
  // production error handler, hides stacktrace
  app.use(function(error, request, response, next) {
    response.status(500);
    response.render("Sorry, but something's broken!", {error: error});
  })
}

module.exports = app;
