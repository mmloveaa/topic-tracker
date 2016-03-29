var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Twitter = require('twitter');

require('dotenv').config();

var client = new Twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret:  process.env.consumer_secret,
  access_token_key:   process.env.access_token_key,
  access_token_secret:  process.env.access_token_secret
});


router.post('/search/tweets', User.authMiddleware ,function(req, res) {

  var query = req.body.interests;
  console.log("req.body: ", req.body.interests);

  client.stream('statuses/filter', {track: req.body.interests},  function(stream){
    stream.on('data', function(tweet) {
      console.log(tweet.text);
    });
  // client.get('search/tweets', {q: query}, function(err, tweets, response){
  //   // console.log("response: ", response)
  //   res.status(err ? 400 : 200).send(err || response);
  // });
  });

});

router.get('/interests',User.authMiddleware, function(req, res){
  console.log('req.user: ',req.user)
  User.findById(req.user._id, function(err, user) {
    res.status(err ? 400 : 200).send(err || user.interests);
  });
})

router.post('/interests',User.authMiddleware, function(req, res){
    // console.log('req.user: ',req.user)
    User.findById(req.user._id, function(err, user) {
      user.interests.push(req.body.interests);
      user.save(function(err,user){
      res.status(err ? 400 : 200).send(err || user.interests);
    });
  });
});

router.delete('/interests',User.authMiddleware, function(req, res){
    // console.log('req.user: ',req.user)
    // req.body what user type in front end, user.interests is the array
    User.findById(req.user._id, function(err, user) {
      user.interests.splice(user.interests.indexOf(req.body.interests),1);
      user.save(function(err,user){
      res.status(err ? 400 : 200).send(err || user.interests);
    });
  });
});

router.get('/', function(req, res) {
  User.find({}, function(err, users) {
    res.status(err ? 400 : 200).send(err || users);
  });
});

router.get('/recipients', User.authMiddleware, function(req, res, next) {
  User.find({_id: {$ne: req.user._id}}, function(err, users) {
    res.status(err ? 400 : 200).send(err || users);
  }).select('username');
});

router.put('/message', User.authMiddleware, function(req, res, next) {
  console.log("Wowwwww")
  var message = req.body;
  message.sender = req.user.username;
  console.log("message: ", message.to._id);
  User.findByIdAndUpdate(message.to._id, {$push: {messages: message}}, function(err, user) {
    console.log('user: ', user)
    res.status(err ? 400 : 200).send(err || user);
  })
})

router.put('/update/:_id', User.authMiddleware, function(req, res, next) {
  console.log("MADE IT TO ROUTE");
  console.log("req body: ",req.body);
  console.log("req params: ",req.params);
  User.findByIdAndUpdate(req.params._id, {$set:{ image: req.body.image }}, {new:true},function(err, user) {
    res.status(err ? 400 : 200).send(err || user);
  });
});

router.delete('/logout', function(req, res) {
  res.clearCookie('cadecookie').send();
});

router.get('/profile', User.authMiddleware, function(req, res) {
  res.send(req.user);
});

router.post('/authenticate', function(req, res) {
  User.authenticate(req.body, function(err, user) {
    if(err) {
      res.status(400).send(err);
    } else {
      var token = user.generateToken();
      res.cookie('cadecookie', token).send(user);
    }
  });
});

router.post('/register', function(req, res) {
  User.register(req.body, function(err, user) {
    if(err) {
      res.status(400).send(err);
    } else {
      var token = user.generateToken();
      res.cookie('cadecookie', token).send(user);
    }
  });
});

module.exports = router;
