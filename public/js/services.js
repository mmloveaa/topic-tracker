'use strict';

var app = angular.module('userAuth');

app.service('AuthService', function($http, $state, UserService) {
  this.register = function(user) {
    return $http.post('/users/register', user)
      .then(function(res) {
        UserService.set(res.data);
      });
  };

  this.login = function(user) {
    return $http.post('/users/authenticate', user)
      .then(function(res) {
        UserService.set(res.data);
      });
  };

  this.logout = function() {
    $http.delete('/users/logout')
    .then(function() {
      UserService.destroy();
      $state.go('home')
    });
  };

  this.init = function() {
    $http.get('/users/profile')
    .then(function(res) {
      UserService.set(res.data);
    });
  };
});


app.service('UserService', function($http) {
  this.set = function(user) {
    console.log(user);
    this.username = user.username;
    this._id = user._id;
    this.image = user.image;
  };
  this.destroy = function() {
    this.username = null;
    this._id = null;
    this.image = null;
  };
  this.update = function(newUser) {
    var userId = this._id;
    console.log("MADE IT TO SERVICE");
    return $http.put(`/users/update/${userId}`,newUser)
    .then(res => {
      this.set(res.data);
    })
  }
});
