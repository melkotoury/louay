angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

})


.controller('loginCtrl', function($scope,Auth) {
   // holds the user data
	
	$scope.user = {email:"",password:""}
	
	// holds the messge erros to appear under each input 
	
	$scope.errorMessage ={email:"",password:""}
	
	$scope.emailLogin = function(){
	//$createUserWithEmailAndPassword
	
		Auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password)
			.then(function(firebaseUser) {
          
			//TODO when user is logged in
		
		}).catch(function(error) {
      
			$scope.error = error;
			//check if the error is realted to the password if correct set $errorMessage.password to it
			if(JSON.stringify($scope.error.message).search("password")!=-1)
	
				$scope.errorMessage.password=$scope.error.message;
	      //case if the error is realted to the email
			else 
			$scope.errorMessage.email = $scope.error.message;
       
		});
	
	};

	
})


.controller('homeCtrl', function($scope) {
  
})



    /* // Create a new user
      Auth.$createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
        .then(function(firebaseUser) {
          	$scope.message = "User created with uid: " + firebaseUser.uid;
				console.log(message);
        }).catch(function(error) {
          $scope.error = error;
			if(JSON.stringify($scope.error.message).includes("password"))
				
				$scope.$errorMessage.password=$scope.error.message;
		else 
				$scope.$errorMessage.email = $scope.error.message;
        });
    

	  */
		