angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,firebase) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

})


.controller('loginCtrl', function($scope,Auth,$http, $state) {
   // holds the user data
	
	$scope.user = {email:"",password:""}
	
	// holds the Message erros to appear under each input 
	
	$scope.errorMessage ={email:"",password:""}
	
	
	$scope.emailLogin = function(){
	//$createUserWithEmailAndPassword
	
		Auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password)
			.then(function(firebaseUser) {
           $state.go("app.home");
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
	
	$scope.facebookLogin = function(){
		//preparing the firebase auth provider
		var provider = new firebase.auth.FacebookAuthProvider();
	   //Setting the scope to get the public profile data with the user
		provider.addScope('public_profile');
      //**Note** asking for more user data will require a review of the app

		Auth.$signInWithPopup(provider).then(function(firebaseUser) {
		 console.log("Signed in as:", firebaseUser);
			 $state.go("app.home");
			//TODO Route after that the user to the rest of the fields in the signup process
		
	  }).catch(function(error) {
	    //TODO show error to the user using a pop up	
		 console.log("Authentication failed:", error);
	  });
	}
	
	$scope.instagramLogin = function(){
	/*To auth in the server needed for the first time only it adds the instgram acess tokken to the DB 
	  which will allow acess to the Instgram API
	*/	
	window.open('https://instgramlogin.herokuapp.com/redirect','_system', 'location=yes');
		//SHOULD BE MOVED TO A SERVICE recives the Coustm tokken for the server side and signin the user with
		
		$http.get("https://instgramlogin.herokuapp.com/log")
    
			.then(function(response) {
			console.log(response.data);	
			firebase.auth().signInWithCustomToken(response.data).then(function(firebaseUser) { 
 						$state.go("app.home");
			}).catch(function(error) {
				//TODO show error to the user using a pop up	
				console.log("Authentication failed:", error);
			});
		})
		
	}

	Auth.$onAuthStateChanged(function(firebaseUser) {
      
		console.log(firebaseUser);
		
	});
	$scope.logout=function(){
	
		Auth.$signOut()
	
	}
	
})


.controller('homeCtrl', function($scope,currentAuth) {
  console.log(currentAuth)
})


.controller('IntroCtrl', function($scope,$state,$timeout) {
//Should be moved to resolve and handled with a promise
	if(localStorage.getItem("Sawintro")=="true")	
		$state.go("app.login");	

$scope.$on("$ionicSlides.sliderInitialized", function(event, data){
  // data.slider is the instance of Swiper
  		$scope.slider = data.slider;
});

$scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
  // note: the indexes are 0-based
  $scope.activeIndex = data.slider.activeIndex;
  $scope.previousIndex = data.slider.previousIndex;
  if(data.slider.activeIndex==2)
	     $timeout(goLogIn, 3000);
	    //Set the sawintro item to true in the local storage , route the user to the login page 
	function goLogIn(){
		localStorage.setItem("Sawintro", "true");
			$state.go("app.login");	
	}

});

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
		