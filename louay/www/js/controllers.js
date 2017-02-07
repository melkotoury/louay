angular.module('starter.controllers', ['ngCordova','ngCordovaOauth'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,firebase,$state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
 $scope.$on('$ionicView.enter', function(e) {
 if(localStorage.getItem("Sawintro")!="true")
	 	$state.go("intro");	

 });

})


.controller('loginCtrl', function($scope,Auth,$http, $state,userData,$cordovaOauth,$ionicLoading,$ionicPopup) {
   // holds the user data
	
	$scope.user = {email:"",password:""}
	
	// holds the Message erros to appear under each input 
	
	$scope.errorMessage ={email:"",password:""}
	
	
	$scope.emailLogin = function(){
	//$createUserWithEmailAndPassword
	$ionicLoading.show({
      template: 'Loading...',
    })
		Auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password)
			.then(function(firebaseUser) {
          $ionicLoading.hide()
			$state.go("app.home");
			//TODO when user is logged in
		
		}).catch(function(error) {
			 		$ionicLoading.hide()
					$ionicPopup.confirm({
					  title: 'Login Erro',
					  template: error.message,
						buttons:[{text: 'Ok'}]
					});
		});
	};
	
	$scope.facebookLogin = function(){
			$ionicLoading.show({
				template: 'Loading...',
			})
       $cordovaOauth.facebook("119327321914256", ["email", "public_profile"], {redirect_uri: "http://localhost/callback"}).then(function(result) {
          var credential = firebase.auth.FacebookAuthProvider.credential(result.access_token);
			 firebase.auth().signInWithCredential(credential).
			 then(function(firebaseUser){
				 console.log(firebaseUser);
				 $ionicLoading.hide()
				 $ionicLoading.show({
				template: 'Loading...',
			})
				 	var userref = firebase.database().ref("/users/"+firebaseUser.uid)
					
					.once('value').then(function(snapshot) {
				  
					if(!snapshot.val()){
					userData.Provider = "facebook";
					userData.UID = firebaseUser.uid;
					userData.displayName = firebaseUser.displayName;
					userData.email   = firebaseUser.email;
					userData.PhotoURI = firebaseUser.photoURL;
						 $ionicLoading.hide()
					 $state.go("app.signup");
				}
				else {   
					$ionicLoading.hide()
						 
					$state.go("app.home");	
				}
			 }).catch(function(error){
				 $ionicLoading.hide()
					$ionicPopup.confirm({
					  title: 'Login Erro',
					  template: error.message,
						buttons:[{text: 'Ok'}]
					});
			 })
           
        }) 
   
		
	})
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
				  console.log(firebaseUser);
 					var userref = firebase.database().ref("/users/"+firebaseUser.uid)
		
					.once('value').then(function(snapshot) {
				  
					if(!snapshot.val()){
					userData.Provider = "instagram";
					userData.UID = firebaseUser.uid;
					userData.displayName = firebaseUser.displayName;
					userData.email   = firebaseUser.email;
					userData.PhotoURI = firebaseUser.photoURL;
					 $state.go("app.signup");
				}
				else 
						 $state.go("app.home");
				
			})
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



.controller('signupCtrl', function($scope,$cordovaCamera,userData,Auth,$state,$ionicLoading,$ionicPopup) {
 
	$scope.user = userData;
	
	//Options for the camera plugin
	var options = {
		destinationType: Camera.DestinationType.FILE_URI,   
		sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
	};

	
  /**
  * @desc open the gallery to pick a picture
  * 
  */
	

	$scope.addImage = function() {
		//call the plugin
	  $cordovaCamera.getPicture(options).then(function(imageURI) {
		 //set the picture to display 
		  $scope.image = imageURI;
        //creting a file enrty with the correct path
		  window.resolveLocalFileSystemURL(imageURI, function (fileEntry) {
     
			  fileEntry.file(function (file) {
              //read the file data
				  var reader = new FileReader();
      
				  reader.onloadend = function () {
        
					  // This blob object can be saved to firebase
         
					  var blob = new Blob([this.result], { type: "image/jpeg" });                  
			       //save it to the PhotoURI
					  $scope.user.PhotoURI = blob;

      
				  };
      
				  reader.readAsArrayBuffer(file);
     
			  });
   
		  }, function (error) {
	
			  $ionicLoading.hide()
    
			  console.log(error)
   
		  });
 
	  });
		
	
	}
	/**
  * 
  
  @desc they act as a type of form validation 
  * 
  */
	
	
	$scope.ToSignup2 = function(){
		
		if($scope.user.displayName && $scope.user.email)
			$state.go("app.signup2")
			else
				$ionicPopup.confirm({	
					title: ' Signup error',
					template: "please fill in all the required fields",
					buttons:[{text: 'Ok'}]
				});
	}
	
	
	$scope.ToSignup3 = function(){	
		if($scope.user.type)
			$state.go("app.signupArtist")
			else
				$ionicPopup.confirm({	
					title: ' Signup error',
					template: "please fill in all the required fields",
					buttons:[{text: 'Ok'}]
				});
	}
	
	
	//Allow signin using social account 
	
	$scope.socialSignup = function(){
	
		$ionicLoading.show({
      template: 'Loading...',
    })
		var userref = firebase.database().ref("/users/"+$scope.user.UID).set({		
			AccountType:  $scope.user.type,			  
			displayName :  $scope.user.displayName		
		});
		
		adduser($scope.user.UID);	
	
	} 

/**
  * @desc Allow user to sign up using email and password  
  *  the user is already signed up but this adds its information to the firebase
  */
	$scope.emailSignup = function(){
	  //check if the user confirmed the password
		$ionicLoading.show({
      template: 'Loading...',
    })
		if($scope.user.pw1 === $scope.user.pw1) {
		  //Create the user
			Auth.$createUserWithEmailAndPassword($scope.user.email, $scope.user.pw1)
				.then(function(firebaseUser) {
				//add the user data to the database
				var userref = firebase.database().ref("/users/"+firebaseUser.uid).set({
					AccountType:  $scope.user.type,
					displayName :  $scope.user.displayName
				});
				$scope.user.Provider = "email";
				//call add user
				adduser(firebaseUser.uid);
			}).catch(function(error) {
				$ionicPopup.confirm({
					  title: ' Signup error',
					  template: error.message,
						buttons:[{text: 'Ok'}]
					});
     $ionicLoading.hide()
						
						});
		}	
	}
	/**
  * @desc add the user data to its proper node 
  *  @prams UID - user ID
  */
	function adduser (UID){
		if($scope.image){
		 var storageRef = firebase.storage().ref("profilepicture/"+UID+".jpeg");
		  storageRef.put($scope.user.PhotoURI).then(function(snapshot) {
			  	console.log('Uploaded a blob or file!');
		  });
		}
		//if the user is artist 
		if($scope.user.type == 'Artist'){			
			
			var userref = firebase.database().ref("/Artist/"+UID)
			
			.set({
					displayName:$scope.user.displayName,
					birthday:$scope.user.birthday,
					Catgories:$scope.user.Catgories,
					mail:$scope.user.email,
					UID:UID,
					Provider:$scope.user.Provider,
					Gender:$scope.user.Gender,
					Height:$scope.user.Height,
					Weight:$scope.user.Weight,
					Bust:$scope.user.Bust,
					Waist:$scope.user.Waist,
				   Hips:$scope.user.Hips,
				   Ethnicity:$scope.user.Ethnicity,
				   Cup:$scope.user.Cup,
				   Dress:$scope.user.Dress,
				   Shoe:$scope.user.Shoe,
				   HairColor:$scope.user.HairColor,
				   HairLength:$scope.user.HairLength,
				   EyeColor:$scope.user.EyeColor,
				  	Shootnudes:$scope.user.Shootnudes,
				  	Tattoos:$scope.user.Tattoos
				})
				.then(function(){
						
					$ionicPopup.confirm({
						title: "Sign up",
						template: "user created",
						buttons:[{text: 'Ok'}]
					
					});
				
					$ionicLoading.hide()
				 
					$state.go("app.home");
				    
				
				})
				.catch(function(error){
					
					$ionicLoading.hide()
					$ionicPopup.confirm({
					
						title: ' Signup error',
					  
						template: error.message,
						
						buttons:[{text: 'Ok'}]
				
					});
					
					console.log("error in adding to firebase");		 
					
					return error;		 
			
				})		
	
			}	
		//if the user is client
		else if (($scope.user.type == 'Client') ){
					
		   var userref = firebase.database().ref("/Client/"+UID)
				
			.set({
					displayName:$scope.user.displayName,
					birthday:$scope.user.birthday,
					Catgories:$scope.user.Catgories,
					mail:$scope.user.email,
					UID:UID,
					Provider:$scope.user.Provider,
					Gender:$scope.user.Gender
				})
				.then(function(){
				$ionicPopup.confirm({
					  title: "Sign up",
					  template: "user created",
						buttons:[{text: 'Ok'}]
					});
				  $state.go("app.home");
				})
				.catch(function(error){
					//TODO ALERT THE USER
					$ionicLoading.hide()
				
					$ionicPopup.confirm({
					  title: ' Signup error',
					  template: error.message,
						buttons:[{text: 'Ok'}]
					});
					console.log("error in adding to firebase");		 
					return error;
				})		
			
			}
}
	
	// when the user clicks it add the category into the array if its already exist it means that the user unchecked it so it will be removed from the array
	$scope.addCategory = function(Category){	
		var index = $scope.user.Catgories.indexOf(Category);
		if(index == -1){
			$scope.user.Catgories.push(Category);
		}
		else {
			$scope.user.Catgories.splice(index,1);
		}
		
		if($scope.user.Catgories.indexOf("Model")!=-1)
		
			$scope.isModel = true;
		else 
			$scope.isModel = false;
	}
	
	
	
	
})



  