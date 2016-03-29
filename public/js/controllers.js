'use strict';

var app = angular.module('userAuth');

app.controller('profileCtrl', function($scope, UserService, $http) {
  console.log("userService: ", UserService);

$scope.$watch(function(){
  return UserService.image;
},function(curr,prev){
    $scope.image = curr;
});


  $scope.update = function(newUser) {
    console.log();
    UserService.update(newUser);
  }
})

app.controller('messagingCtrl', function($scope, $http, UserService) {
  $http.get('/users/recipients')
  .then(function(res){
    $scope.users = res.data; // res.data is the users from line 14 in user.js ,which is all users except me
  });

  $scope.send = function() {
    console.log('message: ', $scope.message);
    $http.put('/users/message', $scope.message)
    .then(function(res){
      alert("You sent the msg!");
    })
  };
});

app.controller('navCtrl', function($scope, UserService, AuthService) {
  $scope.logout = function() {
    AuthService.logout();
  };
  $scope.$watch(function() {
    return UserService.username;
  }, function(username) {
    $scope.username = username;
  });
});

app.controller('authCtrl', function($scope, $state, AuthService) {
  $scope.state = $state.current.name;
  $scope.submit = function(user) {
    if($scope.state === 'register') {
      // submit register form
      if(user.password !== user.password2) {
        $scope.user.password = $scope.user.password2 = '';
        alert('HEY. Passwords gotta match!');
      } else {
        AuthService.register(user)
          .then(function() {
            $state.go('home');
          }, function(err) {
            console.error(err);
          });
      }
    } else {
      // submit login form
      AuthService.login(user)
        .then(function() {
          $state.go('home');
        }, function(err) {
          console.error(err);
        });
    }
  };
});
