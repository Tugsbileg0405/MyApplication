angular.module('starter.token',[])

.factory('token', function($http,$localStorage) {
  
  var service = {};
  
  service.token = function() {
  	 $http.get('demo.urilga.mn:1337/person/'+$localStorage.userdata.user.id).success( function (response){
    	if(response){
    		console.log('baina');
    	}
    	else {
    		console.log('bgui');
    	}
    })
  }
  
  return service;
  
});