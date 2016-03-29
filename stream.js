'use strict';

var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: '9PUJTL0iN0idehKDsPqzEjES3',
  consumer_secret:  'QAa8DaoT6K0iobJ1aoLeEPYM0zTX1EIiRpEzedw573jx3HZIUR',
  access_token_key:   '1061496926-U080SIs2j3oKweA5g2ARlCt8oHQEXFINOGTqjjV',
  access_token_secret:  '4PddPZiTVct4qD0ns6f27R1ZOuJxzNDXK2FvGubSGpLWI',
});

/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/
client.stream('statuses/filter', {track: 'beyonce'},  function(stream){
  stream.on('data', function(tweet) {
    console.log(tweet.text);
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});

// client.get('search/tweets', {q: 'node.js'}, function(error, tweets, response){
//    console.log(tweets.statuses[0].user);
// });
