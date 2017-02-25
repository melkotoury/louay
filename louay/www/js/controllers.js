angular.module('starter.controllers', ['ngCordova','ngCordovaOauth'])

.controller('AppCtrl', function($scope,firebase,$state,userProfile,Auth,$cordovaCamera,$ionicPopup,$ionicHistory) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
 $scope.$on('$ionicView.enter', function(e,data) {
	
 if(localStorage.getItem("Sawintro")!="true")
	 	$state.go("intro");	

 });
		var uid = Auth.$getAuth().uid;
   userProfile.currentMiniData()
		.then(function(data){
		$scope.currentuserMini = data;
	
	});

  
	
	$scope.myprofile = function(){
		$ionicHistory.nextViewOptions({		
				 disableBack: true			 
			 });
		
		$state.go("app.profile",{type:$scope.currentuserMini.AccountType,ID:uid});
		
	}
	
	$scope.goJobs = function(){
		if($scope.currentuserMini.AccountType == "Artist"){
			 $ionicHistory.nextViewOptions({		
				 disableBack: true			 
			 });
			$state.go("app.jobsArtist")
		}
		else {
			 $ionicHistory.nextViewOptions({		
				 disableBack: true			 
			 });
			$state.go("app.jobs")
		}
	}
	
	$scope.addImage = function() {
		var options = {
		destinationType: Camera.DestinationType.FILE_URI,   
		sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
		quality : 30
	};
		
			//call the plugin
	  $cordovaCamera.getPicture(options).then(function(imageURI) {
		 //push to the picture array the picture to display 
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
					  
						if($scope.currentuserfull.profilePictures){

							var storageRef = firebase.storage()
							.ref("userpictures/"+Auth.$getAuth().uid+"/"+$scope.currentuserfull.profilePictures.length+".jpeg");

						}
						else {
							$scope.currentuserfull.profilePictures = [];
							var storageRef = firebase.storage()
							.ref("userpictures/"+Auth.$getAuth().uid+"/0.jpeg");
						}
					  var task = storageRef.put(blob)
						task.then(function(data){
							//add it to the user
							$scope.currentuserfull.profilePictures.push(data.downloadURL)   
							updatePicutres()
						})
				  
				  };

				  reader.readAsArrayBuffer(file);
			
			  });

						  
		  }, function (error) {
					  $ionicLoading.hide()
						 console.log(error)

						
		  });
 
	  });
		
			
		
	}
	
	$scope.logout=function(){
	
		Auth.$signOut();
		$state.go("app.login");	
	
	}
	
	function updatePicutres (){
		var userref = firebase.database().ref("/"+$scope.currentuserMini.AccountType+"/"+$scope.currentuserfull.UID)

			.update({
				profilePictures : $scope.currentuserfull.profilePictures
			}).then(function(){
				$ionicPopup.confirm({
					title: "Sign up",
					template: "user created",
					buttons:[{text: 'Ok'}]
				});
			}).catch(function(error){
				console.log(error);
			}) 
	}
})



















.controller('loginCtrl', function($scope,Auth,$http, $state,userData,$cordovaOauth,$ionicLoading,$ionicPopup ,$ionicHistory) {
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
			 	 
			 $ionicHistory.nextViewOptions({		
				 disableBack: true			 
			 });
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
	
	$scope.goSignup = function(){
		 	 
			 $ionicHistory.nextViewOptions({		
				 disableBack: true			 
			 });
			 $state.go("app.signup");
	}
	
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
					userData.SPP = firebaseUser.photoURL;
					$ionicLoading.hide();
					 $state.go("app.signup");
				}
				else {   
					$ionicLoading.hide()
						
					$ionicHistory.nextViewOptions({
							 disableBack: true 	
					});
					
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
	
	
})


.controller('homeCtrl', function($scope,currentAuth) {
  console.log(currentAuth)
})


.controller('IntroCtrl', function($scope,$state,$timeout) {
//Should be moved to resolve and handled with a promise

	$scope.skip = function(){
		localStorage.setItem("Sawintro", "true");
		$state.go("app.login");	
	}
		
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



.controller('signupCtrl', function($scope,$cordovaCamera,userData,Auth,$state,$ionicLoading,$ionicPopup,$ionicHistory) {
 
	$scope.user = userData;
	
	//Options for the camera plugin
/*	var options = {
		destinationType: Camera.DestinationType.FILE_URI,   
		sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
		quality : 30
	};
*/
	
  /**
  * @desc open the gallery to pick a picture
  * 
  */
  $scope.image = $scope.user.SPP;

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
		
		if($scope.user.displayName && $scope.user.email&& $scope.user.pw1 && $scope.user.pw1)
			$state.go("app.signup2")
			else if ($scope.user.Provider == "facebook"|| $scope.user.Provider == "instagram")
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
	  if($scope.user.Provider == "email"){
		 var storageRef = firebase.storage().ref("profilepicture/"+UID+".jpeg");
		 var task = storageRef.put($scope.user.PhotoURI)
		 
			task.then(function(snapshot){
					$scope.user.pp = snapshot.downloadURL;
			});
	  }
		
		// 
	var userref = firebase.database().ref("/users/"+UID).set({		
			AccountType:  $scope.user.type,			  
			displayName :  $scope.user.displayName,
		   ProfilePicture : $scope.user.pp
		});
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
				  	Tattoos:$scope.user.Tattoos,
				   ProfilePicture :$scope.user.pp,
				   SProfilePicture : $scope.user.SPP
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
					Gender:$scope.user.Gender,
				   ProfilePicture :$scope.user.pp,
					SProfilePicture : $scope.user.SPP
				})
				.then(function(){
				$ionicLoading.hide();
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

.controller('jobsCtrl', function($scope,userProfile,$state,$ionicLoading,$ionicPopup,Auth,$ionicModal) {
	var d = new Date();
	
	var uid = Auth.$getAuth().uid;
	//Get the user jobs 
	//send the user to the job detail  
	
	$scope.gotoDetail = function (index){
		$scope.keys = Object.keys($scope.userJobs);
		 var target = $scope.keys[index];
		if ($scope.userJobs[target].jobKey){
		
			$state.go("app.jobDetail",{posterId:$scope.userJobs[target].postedBy,JobId:$scope.userJobs[target].jobKey});
		}
		
		else{
			$state.go("app.jobDetail",{posterId:uid ,JobId:$scope.keys[index]});
		
		}
		
	}
	
	//popover for adding the job 
 
	$scope.popover = $ionicModal.fromTemplateUrl("templates/addjobs.html", {
		scope: $scope,
		animation: 'slide-in-up'
  
	})
		.then(function(modal) {
    
		$scope.modal = modal;
  
	});
//If the user is a client get its posted jobs
 function getJobs(){
	 firebase.database().ref("/jobs/"+uid+"/")
		 .on('value',function(snapshot) {
		 if(!snapshot.val()){
			 $scope.noJobs = "You don't have jobs currently";
		 }
		 else {
			 $scope.noJobs = false;	
		
			 $scope.$apply(function(){
				 $scope.userJobs = snapshot.val();
				})
		 }
		 
		 console.log($scope.userJobs);
		 console.log($scope.noJobs);	
	 
	 })
	
 }
	function getJobsArtist (){
	firebase.database().ref("/Artist/"+uid+"/bids/")
		.on('value',function(snapshot) {
			if(!snapshot.val()){
				$scope.noJobs = "You don't have jobs currently";
				
			}
			else {
			$scope.noJobs = false;	
			$scope.artist = snapshot.val();
			console.log(	$scope.userJobs);
			}
		})
	}
	
	$scope.search =function (){
  
		var ref =	firebase.database().ref("/categories/"+$scope.job.categorie)
		ref.once("value").then(function(snapshot){
			console.log(snapshot.val());
			$scope.noJobs = false;	
				$scope.$apply(function(){
				 $scope.userJobs = snapshot.val();
				})
			 console.log($scope.userJobs);
		})
	}
	
	//Get the user mini data
	userProfile.currentMiniData()
		.then(function(data){
		$scope.currentuserMini = data;
		
	if($scope.currentuserMini.AccountType == "Artist"){
		
		$scope.isAritst = true;
		getJobsArtist ();
	}
		else {
			$scope.isClient = true;
		  	 getJobs();
		}
		 
	});
	
	//for the job adding
	$scope.job = {title:"",description:"",categorie:"",Budget:"",time:"",location:"",ref:""}
	
	//adds the job to fire thebase
	$scope.addJob = function(){
			$ionicLoading.show({
				template: 'Loading...',
			})
	 var newPostKey = firebase.database().ref().child("/jobs/"+uid+"/").push().key;
    
		firebase.database().ref("/categories/"+$scope.job.categorie+"/"+newPostKey)
      .set({
			postedBy:uid,
			jobKey : newPostKey,
			title:$scope.job.title,
			description : $scope.job.description,
			posterName: $scope.currentuserMini.displayName,
			posterPicture :$scope.currentuserMini.ProfilePicture,
			postedTime : d.getTime()
			
		})
		
		firebase.database().ref("/jobs/"+uid+"/"+newPostKey)
		.set({
			postedBy:uid,
			title:$scope.job.title,
			description : $scope.job.description,
			categorie : $scope.job.categorie,
			Budget : $scope.job.Budget,
			time : $scope.job.time,
			posterName: $scope.currentuserMini.displayName,
			posterPicture :$scope.currentuserMini.ProfilePicture,
			postedTime : d.getTime(),
			location : $scope.job.location,
			ref :$scope.job.ref
		})
		.then(function(){
			
				$ionicLoading.hide();
				$ionicPopup.confirm({
					  title: "Sign up",
					  template: "job added",
						buttons:[{text: 'Ok'}]
					});
					  $scope.modal.remove();
			
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
})


.controller('jobsArtistCtrl', function($scope,Auth) {
  var uid = Auth.$getAuth().uid;
  //Check if there was any pids or jobs
	
			

	
	
	$scope.data = {categorie:""}
//find jobs 
		
	

})



.controller('jobDetailCtrl', function($scope,Auth,$stateParams,userProfile,$ionicModal) {
	//Get the user ID
	var uid = Auth.$getAuth().uid;
	// get the user MiniPorfile data
	userProfile.currentMiniData()
		.then(function(data){
		$scope.currentuserMini = data;	 
	});
  $scope.popover = $ionicModal.fromTemplateUrl("templates/addbid.html", {
		scope: $scope,
		animation: 'slide-in-up'
  
	})
		.then(function(modal) {
    
		$scope.modal = modal;
  
	});
	//Get the job Data
	firebase.database().ref("/jobs/"+$stateParams.posterId+"/"+$stateParams.JobId)
	.on("value",function(snapshot){
		console.log(snapshot.val());
		$scope.jobData = snapshot.val();
		
			//counting Bids
	if($scope.jobData.hasOwnProperty("bids"))
		$scope.bidsCount =Object.keys($scope.jobData.bids).length;
		else
			$scope.bidsCount = 0;
	
	//See if the job has an accepted bider
		
	for(var key in $scope.jobData.bids){
		 if ($scope.jobData.bids.hasOwnProperty(key)) {
			if( $scope.jobData.bids[key].accepeted == "true"){
				
				$scope.acceptedBid = $scope.jobData.bids[key];
			   
		 }
	}
	
	}
		
	//Check if the user Bided if ues show the bid if not not display the add bid
		if(Object.keys($scope.jobData.bids).indexOf(uid) != -1){
			$scope.userBid = $scope.jobData.bids[uid];	
		}
			
	})
	
	$scope.data = {bidDesc : "",amount:""}
	
	//Some State Var for view
	if($scope.currentuserMini.AccountType == "Artist")
		$scope.isAritst = true;
		else 
			$scope.isClient = true;
	
	if(uid == $stateParams.posterId )
		$scope.jobOwner = true;
	
 
	
	//Showing the basic data
$scope.acceptBid = function(bider){
	//update the bid value

	
	//update the value for user
		firebase.database().ref("/jobs/"+$stateParams.posterId+"/"+$stateParams.JobId+"/bids/"+bider)
			.update({
			accepeted:"true"
		})
		
		firebase.database().ref("/Artist/"+bider+"/bids/"+uid)
		
			.update({
			accepeted:"true"
		})
		
}
	
	$scope.Bid = function(){
		//add the bid data to the user
		firebase.database().ref("/Artist/"+uid+"/bids/"+$stateParams.posterId)
		.set({
			jobID:$stateParams.JobId,
			Title :$scope.jobData.title,
			description : $scope.jobData.description,
			postedby:$stateParams.posterId,
			postedTime : $scope.jobData.postedTime,
			posterPicture: $scope.jobData.posterPicture,
			accepeted : "false"
		})
		
			
		firebase.database().ref("/jobs/"+$stateParams.posterId+"/"+$stateParams.JobId+"/bids/"+uid)
		.set({
			biderID : uid,
			bidDesc : $scope.data.bidDesc,
			amount : $scope.data.amount,
			name : $scope.currentuserMini.displayName,
			picture : $scope.currentuserMini.ProfilePicture,
			accepeted : "false"
		})
			.then(function(){
			
			console.log("user Added");
		
		})
		//add the bid data to the job bids
	
	}
	
	//Accept Bid 
	
	
	
})


.controller('tfpCtrl', function($scope,Auth,$ionicLoading,userProfile) {
 	
	var uid = Auth.$getAuth().uid;
		

	var d = new Date()
$scope.tfp = {title:"",description:"",categorie:"",loction:"",reference:""}
	
	userProfile.currentMiniData()
			.then(function(data){
			$scope.currentuserMini = data;	 
		});
	$scope.addTfp = function(){
	$ionicLoading.show({
				template: 'Loading...',
			})
	 var newPostKey = firebase.database().ref().child("/tfp/"+uid+"/").push().key;
    
		firebase.database().ref("/categoriesfp/"+$scope.job.categorie+"/"+newPostKey)
      .set({
			postedBy:uid,
			jobKey : newPostKey,
			title:$scope.tfp.title,
			description : $scope.tfp.description,
			postedTime : d.getTime()
		})
		
		firebase.database().ref("/tfp/"+uid+"/"+newPostKey)
		.set({
			postedBy:uid,
			title:$scope.tfp.title,
			description : $scope.tfp.description,
			categorie : $scope.tfp.categorie,
			location : $scope.tfp.loction,
			duration : $scope.tfp.duration,
			reference :  $scope.tfp.reference,
			posterName: $scope.currentuserMini.displayName,
			posterPicture :$scope.currentuserMini.ProfilePicture,
			postedTime : d.getTime()
		})
		.then(function(){
			
				$ionicLoading.hide();
				$ionicPopup.confirm({
					  title: "TFP",
					  template: "TFP added",
						buttons:[{text: 'Ok'}]
					});
					
				  $state.go("app.jobs");
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

	
}).controller('ProfileCtrl',function($scope,Auth,userProfile,$stateParams){
	          
 	var uid = Auth.$getAuth().uid;
	 $scope.showAbout = true;
	userref = firebase.database().ref("/"+$stateParams.type+"/"+$stateParams.ID)
		.once('value').then(function(snapshot) { 
		$scope.profileData = snapshot.val();
		if(uid == $stateParams.ID)
			$scope.canUpdate = true;
		console.log(snapshot.val());		
	})

	
	//controlling the tabs
	$scope.profileTabs = function(state){
		$scope.tab = state;
      
		if(state == "yard"){
			$scope.showYard = true;
		   $scope.showAbout = false;
		}
		else 
			{
					$scope.showYard = false;
		   		$scope.showAbout = true;
			}
	}
	
	$scope.isSelected = function (checkTab) {
			return ($scope.tab === checkTab);
		};
	
})
