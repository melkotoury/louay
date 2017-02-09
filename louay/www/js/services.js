angular.module('starter.services', ["firebase"])

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

.factory("userProfile" , function(Auth){
	if(Auth.$getAuth()) 
	var currentUserID = Auth.$getAuth().uid;
	
	  var userprofile = {}
	//Method to get the  current  user data
	 	userprofile.miniData = function(){ 
			console.log(currentUserID);
			userref = firebase.database().ref("/users/"+currentUserID)
		
				.once('value').then(function(snapshot) {
			    console.log(snapshot.val());
		
			})
								  
		}
	//Method to get the mini data by UID
	//Method to get the full data by UID
		
		
	return userprofile;
})


