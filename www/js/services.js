
angular.module('starter.services',[])

.factory('myData',function($http){
    return {
        login:function(data){
            return $http.post('http://urilga.mn:1337/login',{email:data.email,password:data.pass,____token:'dXJpbGdhbW5BY2Nlc3M'});
        },
        loginPhone:function(data){
            return $http.post('http://urilga.mn:1337/loginviaphone',{phonenumber:data.email,password:data.pass,____token:'dXJpbGdhbW5BY2Nlc3M'});
        },
        pushtoken:function(data){
            return $http.post('http://urilga.mn:1337/pushtoken',data);
        },
        personInfo:function(data){
            return $http.get('http://urilga.mn:1337/person?person_email='+data+'&____token=dXJpbGdhbW5BY2Nlc3M=');
        },
        person:function(data){
            return $http.get('http://urilga.mn:1337/person/'+data+'?____token=dXJpbGdhbW5BY2Nlc3M=');
        },
        eventInviteByEmail:function(data){
            return $http.post('http://urilga.mn:1337/eventinvite',data);
        },
        eventInviteByPhone:function(data){
            return $http.post('http://urilga.mn:1337/eventinvite',data);
        },
        getpushtoken:function(data){
            return $http.get('http://urilga.mn:1337/pushtoken?token='+data+'&____token=dXJpbGdhbW5BY2Nlc3M=');
        },
        fbLogin: function(data){
            return $http.post('http://www.urilga.mn:1337/loginviafacebook',data);
        }
    }
})
.factory('SlotVote',function($http){
    return {
        get:function(data){
            return $http.get('http://www.urilga.mn:1337/slotvote?voted_by='+data.voted_by+'&slot_info='+data.slot_info+'&____token='+data.____token);
        },
        update:function(data){
            return $http.put('http://www.urilga.mn:1337/slotvote',data);;
        },
        save:function(data){
            return $http.post('http://www.urilga.mn:1337/slotvote',data);
        }
    }
})
;