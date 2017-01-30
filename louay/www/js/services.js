angular.module('starter.services', ["firebase"])

//a re-usable factory that generates the $firebaseAuth instance
.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);