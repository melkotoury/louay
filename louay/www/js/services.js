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
				  pp:""};
	
	return user;
});