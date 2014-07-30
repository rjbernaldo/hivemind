config = {}

config.Twitter = require('twitter');
config.consumer_key = process.env.CONSUMER_KEY;
config.consumer_secret = process.env.CONSUMER_SECRET;
config.access_token_key = process.env.ACCESS_TOKEN_KEY;
config.access_token_secret = process.env.ACCESS_TOKEN_SECRET;
config.dbuser = process.env.DBUSER;
config.dbpass = process.env.DBPASSWORD;
config.mongojs = require('mongojs');
config.db = mongojs(process.env.DATABASE);
config.MS_HOUR = 3600000;
config.MS_DAY = 86400000;
config.GlobeController = require('./globe_controller');
config.LineGraphController = require('./line_graph_controller');
config.Database = require('../models/database');
config.GlobeView = require('../views/globe_view');
config.TweetParser = require('../models/tweet_parser');
config.LineGraphView = require('../views/line_graph_view');

module.exports = config;
