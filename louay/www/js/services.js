angular.module('starter.services', ["firebase","ngCordova"])

//a re-usable factory that generates the $firebaseAuth instance
.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
])

.factory("userData" , function(){
	//Genric user for signup and holding the userdata
	var user = {email:"", 
					displayName:"",
					birthday:"",
					type:"",
					Catgories:[],
					Height:"",
					Weight:"",
					Bust:"",
					Waist:"",
				   Hips:"",
				   Ethnicity:"",
				   Cup:"",
				   Dress:"",
				   Shoe:"",
				   HairColor:"",
				   HairLength:"",
				   EyeColor:"",
				  	Shootnudes:"",
				  	Tattoos:"",
				  	Piercings:"",
				  	PhotoURI:"",
				  	UID:"",
				  	Provider:"",
				  	Gender:"",
					pw1:"",
					pw2:"",
				  pp:"",
				  SPP:""};
	
	return user;
})

.factory("userProfile" , function(Auth,$q){
	if(Auth.$getAuth()) 
	var currentUserID = Auth.$getAuth().uid;
	
	  var userprofile = {}
	  userprofile.fullCurrentProfile = function(accountType){ 
			 var deferred = $q.defer();
			userref = firebase.database().ref("/"+accountType+"/"+currentUserID)
		
				.once('value').then(function(snapshot) {
             console.log(snapshot.val());
				deferred.resolve(snapshot.val())
			  
				
			
		
			})
		 return deferred.promise;				  
		}
	  
	  
	//Method to get the  current  user data
	 	userprofile.currentMiniData = function(){ 
			 var deferred = $q.defer();
			userref = firebase.database().ref("/users/"+currentUserID)
		
				.once('value').then(function(snapshot) {
           
				deferred.resolve(snapshot.val())
			  
				
			
		
			})
		 return deferred.promise;				  
		}
		
		
			userprofile.MiniData = function(currentUserID){ 
			 var deferred = $q.defer();
			userref = firebase.database().ref("/users/"+ID)
		
				.once('value').then(function(snapshot) {
           
				deferred.resolve(snapshot.val())
			  
				
			
		
			})
		 return deferred.promise;				  
		}
			
			
		
		 userprofile.fullProfile = function(accountType,ID){ 
			 var deferred = $q.defer();
			userref = firebase.database().ref("/"+accountType+"/"+ID)
		
				.once('value').then(function(snapshot) {
             console.log(snapshot.val());
				deferred.resolve(snapshot.val())
			  
				
			
		
			})
		
		 }
		 
	
		 return userprofile;
})


.factory("pictures" , function($cordovaCamera,$q){
	var fac = {}

	//Options for the camera plugin
	var options = {
		destinationType: Camera.DestinationType.FILE_URI,   
		sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
		quality : 30
	};

	fac.addImage = function() {
		//call the plugin
			var deferred = $q.defer();
	  $cordovaCamera.getPicture(options).then(function(imageURI) {
		 //set the picture to display 
		  fac.image = imageURI;
        //creting a file enrty with the correct path
		  window.resolveLocalFileSystemURL(imageURI, function (fileEntry) {
     
			  fileEntry.file(function (file) {
              //read the file data
				  var reader = new FileReader();
      
				  reader.onloadend = function () {
        
					  // This blob object can be saved to firebase
         
					  var blob = new Blob([this.result], { type: "image/jpeg" });                  
			       //save it to the PhotoURI
					//  $scope.user.PhotoURI = blob;
              
					  deferred.resolve (Blob)
      
				  };
      
				  reader.readAsArrayBuffer(file);
     
			  });
   
		  }, function (error) {
	
			  $ionicLoading.hide()
    
			  console.log(error)
   
		  });
 
	  });
		
	deferred.promise
	}
	return fac;
})