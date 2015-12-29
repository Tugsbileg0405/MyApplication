var myapp = angular.module('starter.controllers', [])

myapp.factory('onlineStatus', ["$window", "$rootScope", function ($window, $rootScope) {
  var onlineStatus = {};

  onlineStatus.onLine = $window.navigator.onLine;

  onlineStatus.isOnline = function() {
    return onlineStatus.onLine;
  }

  $window.addEventListener("online", function () {
    onlineStatus.onLine = true;
    $rootScope.$digest();
  }, true);

  $window.addEventListener("offline", function () {
    onlineStatus.onLine = false;
    $rootScope.$digest();
  }, true);

  return onlineStatus;
}])


myapp.controller('AppCtrl', function($scope,$interval,$rootScope,$cordovaCamera,$cordovaImagePicker,$ionicPopover,$ionicSideMenuDelegate,$state, $timeout,$ionicLoading,$localStorage,$ionicHistory,$http,$window) {
 $scope.userInfo = $localStorage.userdata.user.person;
 $ionicPopover.fromTemplateUrl('templates/camerapop.html', {
  scope: $scope,
}).then(function(popover) {
  $scope.popover = popover;
});

$rootScope.backsite = "http://www.urilga.mn:1337";


$scope.hide = function($event){
  $scope.popover.hide($event);
}
$scope.show = function($event,data) {
  $scope.popover.show($event);
  $scope.ticketId = data;
};
function encodeImageUri(imageUri)
{
 var c=document.createElement('canvas');
 var ctx=c.getContext("2d");
 var img=new Image();
 img.onload = function(){
   c.width=this.width;
   c.height=this.height;
   ctx.drawImage(img, 0,0);
 };
 img.src=imageUri;
 var dataURL = c.toDataURL("image/jpeg");
 return dataURL;
}
$scope.getPicture = function(){
  var options = {
    quality: 80,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.CAMERA,
    allowEdit: true,
    encodingType: Camera.EncodingType.JPEG,
    targetWidth: 100,
    targetHeight: 100,
    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: false,
    correctOrientation:true
  };

  $cordovaCamera.getPicture(options).then(function(imageData) {
    $scope.pictureURL = "data:image/jpeg;base64," + imageData;
    var mydata = {};
    mydata.id = $scope.userInfo.id;
    mydata.person_profile_img = $scope.pictureURL;
    mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
    $http.put('http://www.urilga.mn:1337/person/'+mydata.id,mydata).success(function (response){
      $localStorage.userdata.user.person = response.updated_person;
    })
  }, function(err) {
      // error
    });
}
$scope.getPhotos = function(){
  var options = {
    quality: 80,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
    allowEdit: true,
    encodingType: Camera.EncodingType.JPEG,
    targetWidth: 100,
    targetHeight: 100,
    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: false
  };

  $cordovaCamera.getPicture(options).then(function(imageData) {
    $scope.imageURL = "data:image/jpeg;base64," + imageData;
    var file = encodeImageUri($scope.imageURL);
    console.log(file);
    var mydata = {};
    mydata.id = $scope.userInfo.id;
    mydata.person_profile_img = $scope.imageURL;
    mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
    console.log($scope.imageURL);
    $http.put('http://www.urilga.mn:1337/person/'+mydata.id,mydata).success(function (response){
      $localStorage.userdata.user.person = response.updated_person;
      console.log('success');
    })
  }, function(err) {
      // error
    });
}
var user_id = $localStorage.userdata.user.person.id;
function checkAll() {
  $http.get('http://www.urilga.mn:1337/ticket?ticket_type=Urilga&ticket_user='+user_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.urilga = response;
  });
  $http.get('http://www.urilga.mn:1337/person/'+user_id+'?____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.user_info = response;
  });
  $http.get('http://www.urilga.mn:1337/ticket?ticket_type=Paid&ticket_type=Free&ticket_user='+user_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.tickets = response;
  });

  $http.get("http://www.urilga.mn:1337/eventlike?liked_by="+user_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.likedEvent = response;
  })
  $http.get("http://www.urilga.mn:1337/eventjoin?joined_by="+user_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.joinedEvent = response;
  })
}
$scope.left = function(){
 $ionicSideMenuDelegate.toggleLeft();
}
$interval(function(){
  checkAll();
},1000);

$scope.myGoBack = function() {
  $ionicHistory.goBack();
}

$scope.userdata = $localStorage.userdata;



$scope.logout = function(){
 $ionicLoading.show({
  content: 'Loading',
  animation: 'fade-in'
});
 $timeout(function (res){
  localStorage.clear();
  $ionicLoading.hide();
  $window.location.reload();
  $state.go('homeLogin', {}, {reload:true});
  console.log('garlaa');
},1000);
};
})

.controller('changePassCtrl',function($scope,$ionicPopup,$ionicLoading,$http,$state,$localStorage){
  $scope.goBack = function(){
    $state.go('app.playlists');
  };
  $scope.userEmail = $localStorage.userdata.user.person.person_email;
  $scope.changepass = function(data){
    if(!data || !data.newpass || !data.newpass_verify){
     var alertPopup = $ionicPopup.alert({
       template: 'Талбарыг бөглөнө үү',
       okType :'button-assertive'
     });
   }
   else {
    if(data.newpass == data.newpass_verify){
     $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
    });
     data.token = 'dXJpbGdhbW5BY2Nlc3M=';
     $http.put('http://www.urilga.mn:1337/user',{email:$scope.userEmail,password:data.newpass,____token:data.token}).success(function (res){
      if(res.status == true){
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
         template: 'Амжилттай өөрчлөгдлөө',
         okType :'button-balanced'
       });
      }
      else {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
         template: 'Амжилтгүй',
         okType :'button-assertive'
       });
      }
    })
   }
   else {
     var alertPopup = $ionicPopup.alert({
       template: 'Нууц үг тохирохгүй байна',
       okType :'button-assertive'
     });
   }
 }
};
})

.controller('tab1Ctrl',function($scope){

})
.controller('PlaylistsCtrl', function($window,$ionicSideMenuDelegate,$scope,onlineStatus,$rootScope,$ionicPopup,$cordovaNetwork,$timeout,$http,$ionicLoading,$localStorage,$ionicScrollDelegate) {
 $ionicLoading.show({
  content: 'Loading',
  animation: 'fade-in'
});
 $scope.onlineStatus = onlineStatus;
 $scope.limit = 5;
 $scope.loadMore = function() {
  if($scope.lists.length > $scope.limit){
    $scope.limit +=5;
  }
  $scope.$broadcast('scroll.infiniteScrollComplete');
};
$scope.toggleLeftSideMenu = function() {
  $ionicSideMenuDelegate.toggleLeft();
};

$scope.clear = function(){
  $scope.search = '';
}
$scope.doRefresh = function() {
  if ($scope.onlineStatus.onLine == true) {
   $timeout (function(){
    $http.get("http://www.urilga.mn:1337/event?event_isActive=true&____token=dXJpbGdhbW5BY2Nlc3M=").success(function (response) {
      $scope.lists = response;
      $localStorage.events = {};
      $localStorage.events.all = [];
      $localStorage.events.today = [];
      $localStorage.events.tomorrow = [];
      $localStorage.events.all = $scope.lists;
      var today = new Date();
      var todayDate = today.toDateString();
      var tomorrow = today.setDate(today.getDate()+1);
      var tomorrow_date = new Date(tomorrow).toDateString();
      $scope.events = {};
      $scope.events.today_event = [];
      $scope.events.tomorrow_event = [];
      $scope.events.upcoming_event = [];
      angular.forEach($scope.lists,function(item){
        var event_date = new Date(item.event_start_date);
        $scope.event_date = event_date.toDateString();
        var event_mill = event_date.valueOf();
        if(todayDate == $scope.event_date){
          $scope.events.today_event.push(item);
          $localStorage.events.today = $scope.events.today_event;
        }
        else if (tomorrow_date == $scope.event_date){
          $scope.events.tomorrow_event.push(item);
          $localStorage.events.tomorrow = $scope.events.tomorrow_event;
        }
      })
      // for( i in $scope.lists){
      //      var event_date = new Date($scope.lists[i].event_start_date);
      //      $scope.event_date = event_date.toDateString();
      //      var event_mill = event_date.valueOf();
      //      if(todayDate == $scope.event_date){
      //         $scope.today_event.push($scope.lists[i]);
      //         $localStorage.events.today = $scope.today_event;
      //         $scope.isHave = 1;
      //      }
      //      else if (tomorrow_date == $scope.event_date) {
      //       $scope.tomorrow_event.push($scope.lists[i]);
      //        $localStorage.events.tomorrow = $scope.tomorrow_event;
      //        $scope.isHave = 1;
      //      }
      //      else if (tomorrow < event_mill) {
      //       $scope.upcoming_event.push($scope.lists[i])
      //        $scope.isHave = 1;
      //      }
      //      else {
      //       $scope.message = 'Хараахан мэдээлэл ороогүй байна.';
      //      }
      // }
    })  
$ionicLoading.hide();
$scope.$broadcast('scroll.refreshComplete');
},1000);
}
else if($scope.onlineStatus.onLine == false){
  var alertPopup = $ionicPopup.alert({
   okType :'button-assertive',
   template: 'Интернет холболтоо шалгана уу'
 });
  alertPopup.then(function(res) {
   $scope.$broadcast('scroll.refreshComplete');
 });
}
}
$scope.loadMore = function() {
 if($localStorage.events.all.length > 5){
  $scope.limit += 5;
  $scope.$broadcast('scroll.infiniteScrollComplete');
}
}
$scope.$on('$stateChangeSuccess', function() {
  $scope.loadMore();
});
$scope.load = function(){
  if($localStorage.events){
    $ionicLoading.hide();
    $scope.events = {};
    $scope.events.tomorrow_event = [];
    $scope.events.today_event = [];
    $scope.lists = $localStorage.events.all;
    $scope.events.tomorrow_event = $localStorage.events.tomorrow;
    $scope.events.today_event = $localStorage.events.today;
    $scope.doRefresh();
  }
  else {
    $scope.doRefresh();
  }
}

$window.onload = $scope.load();

$scope.slideChanged = function(index) {
  $scope.slideIndex = index;
}
$scope.scrollTop = function() {
  $ionicScrollDelegate.scrollTop();
};


$scope.showHeader = function(){
  $('#header').fadeOut();
};

$scope.hideHeader =function(){
  $('#header').fadeIn();
}


})

.controller('ProfileCtrl',function($scope,$state,$ionicLoading,onlineStatus,$ionicPopup,$http,$localStorage,$window,$state,$timeout){
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in'
  });
  $scope.goBack = function(){
    $state.go('app.playlists',{},{reload:true});
  };
  var user_id =  $localStorage.userdata.user.person.id;
  $http.get('http://www.urilga.mn:1337/person/'+user_id+'?____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $ionicLoading.hide();
    $scope.user =response;
  })
  $scope.onlineStatus = onlineStatus
  $scope.Update =function(user){
   $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in'
  });
   if($scope.onlineStatus.onLine == true){
    $scope.mydata = user;
    $scope.mydata.person_email;
    $scope.mydata.token = 'dXJpbGdhbW5BY2Nlc3M=';
    $http.put('http://www.urilga.mn:1337/person/'+user_id,{____token:$scope.mydata.token,person_email:$scope.mydata.person_email,person_firstname:$scope.mydata.person_firstname,person_lastname:$scope.mydata.person_lastname,person_cell_number:$scope.mydata.person_cell_number}).success( function (response){
      if(response.updated_person){
       $localStorage.userdata.user.person = response.updated_person;
       var udata = {};
       udata.email = $scope.mydata.person_email;
       udata.phonenumber = $scope.mydata.person_cell_number;
       udata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
       $http.put('http://www.urilga.mn:1337/user',udata).success(function (response){
        if(response.status == true){
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            okType :'button-balanced',
           template: 'Амжилттай өөрчлөгдлөө'
         });
        }
      })
     }

   })
  }
  else {
   var alertPopup = $ionicPopup.alert({
     okType :'button-assertive',
     template: 'Интернет холболтоо шалгана уу'
   });
 }
};

      //    $scope.checkLength = function(data) {
      //  if(data.person_lastname != $localStorage.userdata.user.person.person_lastname | data.person_firstname != $localStorage.userdata.user.person.person_firstname | data.person_cell_number != $localStorage.userdata.user.person.person_cell_number ){
      //  return false;
      //  }
      //  else {
      //   return true;
      //  }
      // };


    })

.controller('buyTicketCtrl',function($scope,$cordovaToast,onlineStatus,$localStorage,$stateParams,$http,$window,$state,$timeout,$ionicLoading,$ionicPopup){

  $http.get('http://www.urilga.mn:1337/event/'+$stateParams.playlistId+'?____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.event_info = response;
    $scope.event_ticket = {};
    $scope.event_ticket.free = [];
    $scope.event_ticket.paid = [];
    $scope.event_ticket.urilga = [];
    $scope.myevent = false;
    if($scope.event_info.event_created_by.id == $localStorage.userdata.user.person.id){
      $scope.myevent = true
    }
    angular.forEach(response.event_ticket_types,function(item){
      if(item.type == "Paid"){
        $scope.event_ticket.paid.push(item);
      }
      if(item.type == "Free"){
        $scope.event_ticket.free.push(item);
      }
      if(item.type == "Urilga"){
        $scope.event_ticket.urilga.push(item);
      }
    });
  });
  var user_id = $localStorage.userdata.user.person.id;
  $scope.ticket_counter=1;
  $scope.add = function(){
    $scope.ticket_counter += 1;
  };
  $scope.sub = function(){
    if($scope.ticket_counter != 1){
      $scope.ticket_counter -= 1;
    }
  };

  $scope.ticket = {};
  $scope.ticket.ticket_fullname = "";
  $scope.ticket.ticket_email="";
  $scope.ticket.ticket_phonenumber="";

  $scope.suggest = function(ticket){
    console.log('checked')
    $scope.ticket.ticket_fullname = $localStorage.userdata.user.person.person_firstname + ' '+ $localStorage.userdata.user.person.person_lastname;
    $scope.ticket.ticket_email =$localStorage.userdata.user.person.person_email;
    $scope.ticket.ticket_phonenumber = $localStorage.userdata.user.person.person_cell_number;
  }

  $scope.clear = function(ticket){
    console.log('clear');
    ticket.ticket_fullname = "";
    ticket.ticket_email = "";
    ticket.ticket_phonenumber = "";
  };
  
  $scope.check = function(ticket){
    if($scope.isChecked.checked ==true){
      $scope.suggest(ticket);
    }
    else {
      $scope.clear(ticket);
    }
  }
  $timeout(function(){
    $scope.check();
  },1000);

  $scope.isChecked = {checked: true};
  $scope.onlineStatus =onlineStatus;



  $scope.buyTicket = function(ticket){
    if($scope.onlineStatus.onLine == true){
     $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in'
    });
     $scope.mydata = ticket;
     if($scope.ticket_counter > 1){
       $scope.mydata.ticket_fullname = "";
     }
     var etype = JSON.parse(ticket.event_ticket_type);
     if(etype.type == 'Urilga'){
      if(etype.urilga_type == undefined){
        $scope.mydata.ticket_urilga_type = 'basic';
      }
      else {
       $scope.mydata.ticket_urilga_type = etype.urilga_type;
     }
   }
   $scope.mydata.ticket_type = etype.type;
   $scope.mydata.ticket_type_model = etype.id;
   $scope.mydata.ticket_description = etype.description;
   $scope.mydata.ticket_price = etype.price;
   $scope.mydata.ticket_countof = $scope.ticket_counter;
   $scope.mydata.ticket_created_by = user_id;
   $scope.mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
   $http.get('http://www.urilga.mn:1337/person?person_email='+ticket.ticket_email+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    person_info = response[0];
    if(person_info) {
      $scope.mydata.ticket_event = $stateParams.playlistId;
      $scope.mydata.ticket_user_email = person_info.person_email;
      $scope.mydata.ticket_user_name = person_info.person_lastname;
    }
    else {
      $scope.mydata.ticket_event = $stateParams.playlistId;
      $scope.mydata.ticket_user_email = $localStorage.userdata.user.person.person_email;
      $scope.mydata.ticket_user_name  = $localStorage.userdata.user.person.person_lastname;
    }
    $http.post('http://www.urilga.mn:1337/ticket',$scope.mydata).success(function (response){
     if(response.state){
      $ionicLoading.hide();
      var popup = $ionicPopup.alert({
        template:'Тасалбар авах боломжгүй',
        okType :'button-assertive'
      })
    }
    else{
      $scope.ticket_id = response.ticket_transaction_id;
      $ionicLoading.hide();
      var popup = $ionicPopup.alert({
        template:'Худалдан авалт амжилттай боллоо.',
        okType :'button-balanced'
      })
      popup.then(function() {
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in'
        });
            // $http.post('http://www.urilga.mn:1337/ticketmessage',{ticket:$scope.ticket_id}).success(function (res){
             $state.go('app.buyticketImg',{eventId:$scope.ticket_id});
             $ionicLoading.hide();

           });
    }
  })
  });

}
else {
  var alertPopup = $ionicPopup.alert({
   okType :'button-assertive',
   template: 'Интернет холболтоо шалгана уу'
 });
  alertPopup.then(function(res) {
   $scope.$broadcast('scroll.refreshComplete');
 });
}
}

$scope.goBack = function(){
  $window.history.back();
};
})


.controller('myEventCtrl',function($scope,$localStorage,$interval,$ionicPopup,onlineStatus,$ionicLoading,$http,$window,$state,$timeout){
 $ionicLoading.show({
  content: 'Loading',
  animation: 'fade-in'
});


 $scope.makePrivate = function(data){
  var mydata = {};
  mydata.id = data.id;
  mydata.event_isActive = false;
  mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
  $http.put('http://www.urilga.mn:1337/event',mydata).success(function (res){
    if(status == true){
      console.log('amjilttai');
    }
  })
}
$scope.makePublic = function(data){
 var mydata = {};
 mydata.id = data.id;
 mydata.event_isActive = true;
 mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
 $http.put('http://www.urilga.mn:1337/event',mydata).success(function (res){
  if(status == true){
    console.log('amjilttai');
  }
})
}
$scope.onlineStatus = onlineStatus;
$scope.doRefresh = function(){
  if($scope.onlineStatus.onLine == true){
    $timeout(function(){
     $http.get('http://www.urilga.mn:1337/event?event_created_by='+user_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
      $scope.myEvents = response;
      $localStorage.myEvents = response;
    })
     $ionicLoading.hide();
     $scope.$broadcast('scroll.refreshComplete');
   },1000);
  }
  else {
    var alertPopup = $ionicPopup.alert({
     okType :'button-assertive',
     template: 'Интернет холболтоо шалгана уу'
   });
    alertPopup.then(function(res) {
     $scope.$broadcast('scroll.refreshComplete');
   });
  }
}
$scope.onLoad = function (){
  $scope.myEvents = $localStorage.myEvents;
  $ionicLoading.hide();
  $scope.doRefresh();
}
$window.onload = $scope.onLoad();

var user_id = $localStorage.userdata.user.person.id;


$scope.goBack = function(){
  $state.go('app.playlists');
};
})

.controller('myOrgCtrl',function($scope,$interval,$localStorage,$ionicPopup,onlineStatus,$ionicLoading,$http,$window,$state,$timeout){
 $ionicLoading.show({
  content: 'Loading',
  animation: 'fade-in'
});
 $scope.onlineStatus = onlineStatus;
 $scope.doRefresh = function(){
  if($scope.onlineStatus.onLine == true){
    $timeout(function(){
     $http.get('http://www.urilga.mn:1337/org?organization_created_by='+user_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
      $scope.myOrgs = response;
      $localStorage.myOrgs = response;
    })
     $scope.$broadcast('scroll.refreshComplete');
     $ionicLoading.hide();
   },1000);
  }
  else {
    var alertPopup = $ionicPopup.alert({
     okType :'button-assertive',
     template: 'Интернет холболтоо шалгана уу'
   });
    alertPopup.then(function(res) {
     $scope.$broadcast('scroll.refreshComplete');
   });
  }
}
$scope.onLoad = function(){
  $scope.myOrgs = $localStorage.myOrgs;
  $ionicLoading.hide();
  $scope.doRefresh();
}
window.onload = $scope.onLoad();

var user_id = $localStorage.userdata.user.person.id;


$scope.goBack = function(){
  $window.history.back();
};
})

.controller('OrgCtrl',function($scope,$localStorage,onlineStatus,$ionicPopup,$ionicLoading,$http,$window,$state,$timeout,$stateParams){
 $ionicLoading.show({
  content: 'Loading',
  animation: 'fade-in'
});

 $http.get('http://www.urilga.mn:1337/org/'+$stateParams.myOrgId+'?____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
  $scope.org = response;
  $ionicLoading.hide();
});

 $scope.Update = function(data){
   if(onlineStatus.onLine == true){
    $http.put('http://www.urilga.mn:1337/org/'+$stateParams.myOrgId,{organization_fullname:data.organization_fullname,organization_register_id:data.organization_register_id,organization_email:data.organization_email,organization_website:data.organization_website,organization_work_number:data.organization_work_number}).success( function (response){

     $ionicPopup.alert({
       template: 'Амжилттай',
       okType :'button-balanced'
     });
   })
  }
  else {
   $ionicPopup.alert({
     okType :'button-assertive',
     template: 'Интернет холболтоо шалгана уу'
   });
 }
}

$scope.goBack = function(){
  $window.history.back();
};
})

.controller('CategoryItemCtrl', function($ionicPopover,$rootScope,$scope,$state,$ionicLoading,onlineStatus,$localStorage,$ionicPopup,$timeout,$http,$stateParams,$window) {     
 $ionicLoading.show({
  content: 'Loading',
  animation: 'fade-in'
});
 $ionicPopover.fromTemplateUrl('templates/filter.html', {
  scope: $scope,
}).then(function(popover) {
  $scope.popover1 = popover;
});
$scope.hidePop = function($event){
  $scope.popover1.hide($event);
}
$scope.showPop = function($event) {
  $scope.popover1.show($event);
};
$scope.sortType     = 'event_start_date'; 
$scope.sortReverse  =  false;

$scope.sortName = [
{ text:"A-Z",name: "downName", icon: 'fa-sort-alpha-asc'},
{ text:"Z-A",name: "upName", icon: 'fa-sort-alpha-desc'}
];
$scope.sortType = [
{ text:"Үнэгүй", eventType: "free"},
{ text:"Төлбөртэй", eventType: "paid"}
];
$scope.counter = 0;
$scope.sortByType = function(data){
  delete data.name;
  $scope.event_type = {};
  $scope.event_type.freeEvent = [];
  $scope.event_type.paidEvent = [];
  angular.forEach($scope.events,function(item){
    if(item.event_ticket_type == 'Free'){
      $scope.event_type.freeEvent.push(item);
    }
    else if (item.event_ticket_type == 'Paid'){
      $scope.event_type.paidEvent.push(item);
    }
  })
  if(data.eventType == 'free'){
    $scope.counter = 1;
  }
  else if (data.eventType == 'paid'){
    $scope.counter = 2;
  }
  $scope.hidePop();
}
$scope.sortByName = function(data){
  delete data.eventType;
  if(data.name == 'downName'){
    $scope.sortType = 'event_title';
    $scope.sortReverse = false;
    $scope.counter = 0;
  }
  else if (data.name == 'upName'){
    $scope.sortType = 'event_title';
    $scope.sortReverse = true;
    $scope.counter = 0;
  }
  $scope.hidePop();
}
$scope.sortByDate = function(data){
  delete data.eventType;
  delete data.name;
  if(data.date == 'downDate'){
    $scope.sortType = 'event_start_date';
    $scope.sortReverse = false;
  }
  else if (data.date == 'upDate'){
    $scope.sortType = 'event_start_date';
    $scope.sortReverse = true;
  }
  $scope.hidePop();
}
$scope.onlineStatus = onlineStatus;
$scope.doRefresh = function() {
  if($scope.onlineStatus.onLine == true) {
    $timeout (function(){
      $http.get('http://www.urilga.mn:1337/category/'+$stateParams.category_Id+'?____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
        $scope.items = response;
        var results = response.events;
        $scope.allEvent = {};
        $scope.events = [];
        angular.forEach(results,function(item){
          if(item.event_isActive == true){
            $scope.events.push(item);
          }
        })
        $scope.counter = 0;
        $ionicLoading.hide();
      })
      $scope.$broadcast('scroll.refreshComplete');
    },1000);
  }
  else {
    var alertPopup = $ionicPopup.alert({
     okType :'button-assertive',
     template: 'Интернет холболтоо шалгана уу'
   });
    alertPopup.then(function(res) {
     $scope.$broadcast('scroll.refreshComplete');
   });
  }
},

$scope.eventid = $stateParams.category_Id;
$window.onload = $scope.doRefresh();
$scope.goBack = function(){
  $state.go('app.playlists');
};

})

.controller('searchCtrl',function($scope,$resource,$http,$stateParams,$ionicLoading,$filter,$ionicHistory){
  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  }
  $scope.counter = 0;
  $scope.searchTitle = function(data){
   if(data == ""){
    data = undefined;
  }
  var searchText = escape(data);
  $http.get('http://www.urilga.mn:1337/event?event_title=%'+searchText+'%'+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    if(response.length>0){
      $scope.items = response;
      $scope.counter = 1;
    }
    else {
      $scope.counter = 2;
      $scope.message ='Арга хэмжээ олдсонгүй';
    }
  })
}
$scope.clear = function(){
  $scope.search = undefined;
  delete $scope.items;
  $scope.counter = 0;
};
})

.controller('InvitationCtrl', function($scope,$interval,$rootScope,$ionicLoading,$ionicPopup,onlineStatus,$timeout,$http,$stateParams,$localStorage,$ionicModal,$ionicSlideBoxDelegate,$window) {

  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in'
  }); 

  $scope.acceptTicket = function(data){
    var mydata = {};
    mydata.id = data.id;
    mydata.ticket_isActive = true;
    mydata.____token ='dXJpbGdhbW5BY2Nlc3M=';
    $http.put('http://www.urilga.mn:1337/ticket/'+mydata.id,mydata).success(function (response){
      $scope.doRefresh();
    })
    console.log('accepted');
  }
  $scope.deleteTicket = function(data){
    var mydata = {};
    mydata.id = data.id;
    mydata.token ='dXJpbGdhbW5BY2Nlc3M=';
    $http.delete('http://www.urilga.mn:1337/ticket/'+mydata.id+'?____token='+mydata.token).success(function (response){
      console.log('rejected');
      $scope.doRefresh();
    })

  }
  $scope.deleteConfirm = function(data) {
   var confirmPopup = $ionicPopup.confirm({
     cssClass: 'deleteButton',
     cancelText: 'Болих',
     okText: 'Устгах',
     okType: 'button-assertive',
     template: 'Та устгахдаа итгэлтэй байна уу'
   });
   confirmPopup.then(function(res) {
     if(res) {
       $scope.deleteTicket(data);
     } else {
       console.log('You are not sure');
     }
   });
 };
 $scope.goBack = function(){
  $window.history.back();
}
$scope.onlineStatus = onlineStatus;
$scope.doRefresh = function() {
  if($scope.onlineStatus.onLine == true) {
    $timeout (function(){
     var user_id = $localStorage.userdata.user.person.id;
     $http.get('http://www.urilga.mn:1337/ticket?ticket_type=Urilga&ticket_user='+user_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
      $scope.urilga = response;
      $localStorage.urilga = $scope.urilga;
    })
     $ionicLoading.hide();
     $ionicSlideBoxDelegate.update();
     $scope.$broadcast('scroll.refreshComplete');
   },1000);
  }
  else {
    var alertPopup = $ionicPopup.alert({
     okType :'button-assertive',
     template: 'Интернет холболтоо шалгана уу'
   });
    alertPopup.then(function(res) {
     $scope.$broadcast('scroll.refreshComplete');
   });
  }
}
$scope.onLoad = function(){
  $scope.uriga = $localStorage.urilga;
  $ionicLoading.hide();
  $scope.doRefresh();
}
$window.onload = $scope.onLoad();
$interval(function(){
 $ionicSlideBoxDelegate.update();
});
$ionicModal.fromTemplateUrl('templates/barcode.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function(modal) {
  $scope.modal = modal;
});
$scope.xaxa= '';
$scope.openModal = function(data) {
  $scope.xaxa =  data.toString();
  $scope.modal.show();
};

$scope.closeModal = function() {
  $scope.modal.hide();
};

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      console.log('Modal is shown!');
    });
    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    }

    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    }

    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    }
    
    $scope.show = function(data){
      $ionicSlideBoxDelegate.update();
      $scope.openModal();
    };
  })

.controller('TicketCtrl',function($scope,$interval,$localStorage,$ionicPopup,onlineStatus,$ionicLoading,$state,$ionicSlideBoxDelegate,$localStorage,$http,$timeout,$window){

 $ionicLoading.show({
  content: 'Loading',
  animation: 'fade-in'
}); 


 $timeout(function(){
   $ionicSlideBoxDelegate.update();
 },1000);


 $scope.acceptTicket = function(data){
  var mydata = {};
  mydata.id = data.id;
  mydata.ticket_isActive = true;
  mydata.____token ='dXJpbGdhbW5BY2Nlc3M=';
  $http.put('http://www.urilga.mn:1337/ticket/'+mydata.id,mydata).success(function (response){
    $scope.doRefresh();
  })
  console.log('accepted');
}
$scope.deleteTicket = function(data){
  var mydata = {};
  mydata.id = data.id;
  mydata.____token ='dXJpbGdhbW5BY2Nlc3M=';
  $http.delete('http://www.urilga.mn:1337/ticket/'+mydata.id+'?____token='+mydata.____token).success(function (response){
    console.log('rejected');
    $scope.doRefresh();
  })
  
}
$scope.onlineStatus = onlineStatus;
$scope.doRefresh = function() {
  if($scope.onlineStatus.onLine == true){
    $timeout (function(){
     var user_id = $localStorage.userdata.user.person.id;
     $http.get('http://www.urilga.mn:1337/ticket?ticket_type=Free&ticket_type=Paid&ticket_user='+user_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
      $scope.tickets = response;
      $ionicSlideBoxDelegate.update();
      $localStorage.tickets = $scope.tickets;
    })
     $ionicLoading.hide();
     $scope.$broadcast('scroll.refreshComplete');
   },1000);
  }
  else {
    var alertPopup = $ionicPopup.alert({
     okType :'button-assertive',
     template: 'Интернет холболтоо шалгана уу'
   });
    alertPopup.then(function(res) {
     $scope.$broadcast('scroll.refreshComplete');
   });
  }
}

$scope.onload = function (){
  $scope.tickets = $localStorage.tickets;
  $scope.doRefresh();
  $ionicLoading.hide();
}

window.onload = $scope.onload();
$scope.goBack = function(){
  $window.history.back();
};

})

.controller('ticketNumberCtrl', function($scope,$http,$ionicLoading,$stateParams,$localStorage,$timeout,$window) {

  $scope.goBack = function(){
    $window.history.back();
  };
  $scope.eventid = $stateParams.playlistId;
  $scope.acceptTicket = function(data){
    var mydata = {};
    mydata.id = data.id;
    mydata.ticket_isActive = true;
    mydata.____token ='dXJpbGdhbW5BY2Nlc3M=';
    $http.put('http://www.urilga.mn:1337/ticket/'+mydata.id,mydata).success(function (response){
      $scope.doRefresh();
    })
    console.log('accepted');
  }
  $scope.deleteTicket = function(data){
    var mydata = {};
    mydata.id = data.id;
    mydata.____token ='dXJpbGdhbW5BY2Nlc3M=';
    $http.delete('http://www.urilga.mn:1337/ticket/'+mydata.id+'?____token='+mydata.____token).success(function (response){
      console.log('rejected');
      $scope.doRefresh();
    })

  }
  var user_id = $localStorage.userdata.user.person.id;
  $scope.doRefresh = function() {
    $timeout(function(){
     $ionicLoading.show({
       content: 'Loading',
       animation: 'fade-in'
     })     
     $http.get('http://www.urilga.mn:1337/ticket?ticket_type=Paid&ticket_type=Free&ticket_user='+user_id+'&ticket_event='+$scope.eventid+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
      $scope.TicketOfEvent = response;
      $ionicLoading.hide();
    })
     $scope.$broadcast('scroll.refreshComplete');  
   },1000);
  }
  window.onload = $scope.doRefresh();
})

.controller('MainCtrl',function($scope,myData,onlineStatus,$cordovaOauth,$cordovaFacebook,$cordovaToast,$state,$ionicPopup,$localStorage,$http,$ionicLoading,$window,$timeout){

  $scope.facebookLogin = function() {
    $cordovaOauth.facebook("512066465633383", ["email"]).then(function (result) {
      $localStorage.accessToken = result.access_token;
      $http.get("https://graph.facebook.com/v2.5/me", { params: { access_token: $localStorage.accessToken, fields: "id,name,gender,location,website,picture,relationship_status,email" }}).then(function(result) {
        $ionicLoading.show({
         content: 'Loading',
         animation: 'fade-in'
       }) 
        var userdata = {};
        userdata.email = result.data.email;
        userdata.fb_id = result.data.id;
        userdata.name = result.data.name;
        userdata.picture = result.data.picture.data.url;
        userdata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
        myData.fbLogin(userdata).success(function (response){
          if(response.status == true){
            $localStorage.userdata = response;
            $ionicLoading.hide();
            $state.go('app.playlists', {}, {reload:true});
          }
          else {
           $ionicLoading.hide();
           var alertPopup = $ionicPopup.alert({
             okType :'button-assertive',
             template: response.message
           });
           alertPopup.then(function(res) {
            $state.go('main',{}, {reload:true});
          });
         }
       })
        console.log(userdata);
      }, function(error) {
        alert("There was a problem getting your profile.  Check the logs for details.");
        console.log(error);
      });            
}, function(error) {
  console.log(JSON.stringify(error));
});
}



// function refresh() {

//   $facebook.api("/me?fields=last_name, first_name, email, gender, locale, link").then( 
//     function(response) {
//       $scope.welcomeMsg = "Welcome " + response.name;
//       $scope.isLoggedIn=true;
//       $scope.fbUser = response;
//       console.log($scope.fbUser);
//       console.log($scope.fbUser.email);
//       $facebook.api('/me/picture').then(function(response){
//         $scope.picture = response.data.url;
//         console.log($scope.picture);
//         $facebook.api('/me/permissions').then(function(response){
//           $scope.permissions = response.data;
//         });
//       });
//       $http.get("http://www.urilga.mn:1337/person?person_email="+$scope.fbUser.email).success(function (data){
//         if(data[0]){
//           console.log(data[0]);
//           $localStorage.userdata = data[0];
//           $http.post("http://www.urilga.mn:1337/login",{email:"tugu0405@gmail.com",password:"123456"}).success(function(response){
//             if(response.status == true) {
//               $localStorage.userdata = response;
//               $state.go('app.playlists',{},{reload:true});
//             }
//             else {
//              $cordovaToast.show(response.message,'short','bottom');

//            }
//          })

//         }else{
//           console.log("bgui");
//         }
//       }) 
//     },
//     function(err) {
//       $scope.welcomeMsg = "Please log in";
//     });
// }

// refresh();


// $scope.onlineStatus = onlineStatus;
// $scope.autoLogin = function() {
//   if($scope.onlineStatus.onLine == true){
//     if($localStorage.loginData !== undefined ){
//       $ionicLoading.show({
//        content: 'Loading',
//        animation: 'fade-in'

//      })
//       $scope.emails = $localStorage.loginData.email;
//       $scope.pass = $localStorage.loginData.pass;
//       $http.post("http://www.urilga.mn:1337/login",{email:$scope.emails,password:$scope.pass}).success(function (response){
//         if(response.status == true) {

//          $localStorage.userdata = response;
//          $state.go('app.playlists',{},{reload:true});
//        }
//      })
//     }
//     else{
//       console.log('hooson bna');
//     }
//   }
//   else {
//    var alertPopup = $ionicPopup.alert({
//      okType :'button-assertive',
//      template: 'Интернет холболтоо шалгана уу'
//    });
//  }
// }


//$scope.autoLogin();

$scope.login = function(data) {
  if(onlineStatus.onLine == true){
    if(!data || !data.email || !data.pass ){
     var alertPopup = $ionicPopup.alert({
       okType :'button-assertive',
       template: 'Бүх талбарыг бөглөнө үү'
     });
   }
   else {
     $ionicLoading.show({
       content: 'Loading',
       animation: 'fade-in'
     }) 
     if(isNaN(data.email)){
       myData.login(data).success(function (response) {
        if (response.status == true){   
          $localStorage.userdata = response;
          $ionicLoading.hide();
          $state.go('app.playlists', {}, {reload:true});
        }
        else {
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
           okType :'button-assertive',
           template: response.message
         });
        }
      })
     }
     else {
      myData.loginPhone(data).success(function (response) {
       if (response.status == true){   
        $localStorage.userdata = response;
        $ionicLoading.hide();
        $state.go('app.playlists', {}, {reload:true});
      }
      else {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          okType :'button-assertive',
          template: response.message
        });
      }
    })
    }
  }
}
else {
  var alertPopup = $ionicPopup.alert({
    okType :'button-assertive',
    template: 'Интернет холболтоо шалгана уу'
  });
}
}

})

.controller('SavedItemCtrl',function($timeout,$interval,$localStorage,$ionicHistory,$scope,$state,onlineStatus,$ionicPopup,$ionicLoading,$localStorage,$http,$stateParams,$window){

  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in'
  });

  $scope.onlineStatus = onlineStatus;
  $scope.doRefresh = function() {
    if($scope.onlineStatus.onLine == true){
      $timeout (function(){
        $http.get("http://www.urilga.mn:1337/eventlike?liked_by="+person_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
          $scope.likedEvent = response;
          $localStorage.savedEvents = $scope.likedEvent;
        })
        $scope.$broadcast('scroll.refreshComplete');
        $ionicLoading.hide();
      },1000);
    }
    else {
      var alertPopup = $ionicPopup.alert({
       okType :'button-assertive',
       template: 'Интернет холболтоо шалгана уу'
     });
      alertPopup.then(function(res) {
       $scope.$broadcast('scroll.refreshComplete');
     });
    }
  }
  $scope.onload = function(){
    $scope.likeEvent = $localStorage.savedEvents;
    $scope.doRefresh();
    $ionicLoading.hide();
  }
  $window.onload = $scope.onload();

  $scope.goBack = function(){
    $state.go('app.playlists');
  }
  var person_id = $localStorage.userdata.user.person.id;
  $scope.deleteSavedEvent = function(data){
   var confirmPopup = $ionicPopup.confirm({
     template: 'Устгахдаа итгэлтэй байна уу?',
     okText: 'Тийм',
     okType : 'button-assertive',
     cancelText: 'Үгүй'
   });
   confirmPopup.then(function(res) {
     if(res) {
      var event_id = data;
      $http.get("http://www.urilga.mn:1337/eventlike?event_info="+event_id+"&liked_by="+person_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response) {
        var delete_event_id = response[0].id;
        var token='dXJpbGdhbW5BY2Nlc3M=';
        $http.delete("http://www.urilga.mn:1337/eventlike/"+delete_event_id+'?____token='+token).success(function (response){
          if(response.state == 'OK'){
            $scope.doRefresh();
          }
        })
      });
    } else {
     console.log('You are not sure');
   }
 });

 };

})

// .controller('JoinedItemCtrl',function($timeout,$ionicHistory,$scope,$state,onlineStatus,$ionicPopup,$ionicLoading,$localStorage,$http,$stateParams,$window){

//   $ionicLoading.show({
//     content: 'Loading',
//     animation: 'fade-in'
//   });

//   $scope.onlineStatus = onlineStatus;
//   $scope.doRefresh = function() {
//     if($scope.onlineStatus.onLine == true){
//       $timeout (function(){
//         $http.get("http://www.urilga.mn:1337/eventjoin?joined_by="+person_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
//           $scope.joinedEvent = response;
//         })
//         $scope.$broadcast('scroll.refreshComplete');
//         $ionicLoading.hide();
//       },1000);
//     }
//     else {
//       var alertPopup = $ionicPopup.alert({
//        template: 'Интернет холболтоо шалгана уу',
//        okType:'button-assertive'
//      });
//       alertPopup.then(function(res) {
//        $scope.$broadcast('scroll.refreshComplete');
//      });
//     }
//   }

//   window.onload = $scope.doRefresh();

//   $scope.goBack = function(){
//     $scope.doRefresh();
//     $window.history.back();
//   }
//   var person_id = $localStorage.userdata.user.person.id;
//   $scope.deletejoinedEvent = function(data){
//    var confirmPopup = $ionicPopup.confirm({
//      template: 'Устгахдаа итгэлтэй байна уу?',
//      okType : 'button-assertive'
//    });
//    confirmPopup.then(function(res) {
//      if(res) {
//       var event_id = data;
//       $http.get("http://www.urilga.mn:1337/eventjoin?event_info="+event_id+"&joined_by="+person_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response) {
//         var delete_event_id = response[0].id;
//         $http.delete("http://www.urilga.mn:1337/eventjoin/"+delete_event_id).success(function (response){
//           if(response.state == 'OK'){
//             $scope.doRefresh();
//           }
//         })
//       });
//     } else {
//      console.log('You are not sure');
//    }
//  });

//  };

// })



.controller('RegCtrl',function($scope,$ionicLoading,$state,$cordovaCamera,$ionicPopover,onlineStatus,$cordovaCamera,$cordovaToast,$ionicPopup,$http,$window){

  $ionicPopover.fromTemplateUrl('templates/camerapop.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $scope.hide = function($event){
    $scope.popover.hide($event);
  }
  $scope.show = function($event) {
    $scope.popover.show($event);
  };
  $scope.pictureURL = 'default.png';
  $scope.getPicture = function(){
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 80,
      targetHeight: 80,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.pictureURL = "data:image/jpeg;base64," + imageData;

    }, function(err) {
      // error
    });
  }
  $scope.getPhotos = function(){
    var options = {
      quality: 80,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      console.log(imageData);
      $scope.pictureURL = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });

  }
  $scope.goBack = function(){
    $window.history.back();
  }
  $scope.onlineStatus = onlineStatus;
  $scope.Register = function(data) {
    if($scope.onlineStatus.onLine == true){
      if (!data || !data.fname || !data.uname || !data.pass || !data.email || !data.phone ) {
       var alertPopup = $ionicPopup.alert({
         template: 'Бүх талбарыг бөглөнө үү',
         okType : 'button-assertive'
       });
     }
     else {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
      });
      data.token = 'dXJpbGdhbW5BY2Nlc3M=';
      $http.post("http://www.urilga.mn:1337/person", {____token:data.token,person_firstname:data.fname,person_lastname:data.uname,person_email:data.email,person_cell_number:data.phone,person_profile_img:$scope.pictureURL}).success(function (response) {
       console.log(response);
       if(response.error) {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
         template: 'Таны утасны дугаар эсвэл и-мэйл хаяг бүртгэлтэй байна.',
         okType :'button-assertive'
       });
      }
      else {
        var person_id = response.id;
        $http.post("http://www.urilga.mn:1337/user",{____token:data.token,phonenumber:data.phone,email:data.email,person:person_id,password:data.pass}).success(function(res){
          console.log(res);
          if(res.error){
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
             template: res.error,
             okType :'button-assertive'
           });
          }
          else {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
             template: 'Амжилттай бүртгүүллээ',
             okType :'button-balanced'
           });
            alertPopup.then(function(res) {
             $state.go('main',{},{reload:true});
           });
          }
        })
      }
    })
}  
}
else {
  var alertPopup = $ionicPopup.alert({
   template: 'Интернет холболтоо шалгана уу',
   okType :'button-assertive'
 });
  alertPopup.then(function(res) {
   $scope.$broadcast('scroll.refreshComplete');
 });
}
};
})

.controller('ForgotPasswordCtrl',function($scope,$state,$ionicLoading,$ionicPopup,$state,$window,$http){
  $scope.goBack = function(){
    $window.history.back();
  };
 //  $scope.showIndex = 0;
 //  $scope.checkEmail = function(data){
 //    if(!data){
 //      var alertPopup = $ionicPopup.alert({
 //       template: 'Талбарыг бөглөнө үү',
 //       okType :'button-assertive'
 //     });
 //    }
 //    else {
 //     $ionicLoading.show({
 //      content: 'Loading',
 //      animation: 'fade-in',
 //    });
 //     $http.get('http://www.urilga.mn:1337/person?person_email='+data+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (res){
 //      if(res.length > 0){
 //        $scope.showIndex = 1;
 //        $ionicLoading.hide();
 //      }
 //      else {
 //        $ionicLoading.hide();
 //        var alertPopup = $ionicPopup.alert({
 //         template: 'Бүртгэлгүй и-мэйл байна',
 //         okType :'button-assertive'
 //       });
 //      }
 //    })
 //   }
 // }
 $scope.changePassword = function(data){
  if(!data || !data.change){
   var alertPopup = $ionicPopup.alert({
     template: 'Талбарыг бөглөнө үү',
     okType :'button-assertive'
   });
 }
 else {
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
  });
  if(!isNaN(data.change)){
    data.token = 'dXJpbGdhbW5BY2Nlc3M=';
    $http.post('http://www.urilga.mn:1337/userforgotpassword1',{phonenumber___:data.change,____token:data.token}).success(function (res){
      console.log(res);
      if(res.state == 'OK'){
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
         template: res.message,
         okType :'button-balanced'
       });
        alertPopup.then(function(res) {
         $state.go('main', {}, {reload:true});
       });
      }
      else {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
         template: res.state,
         okType :'button-assertive'
       });
      }
    })
  }
  else {
    data.token = 'dXJpbGdhbW5BY2Nlc3M=';
    $http.post('http://www.urilga.mn:1337/userforgotpassword',{email___:data.change,____token:data.token}).success(function (res){
      console.log(res);
      if(res.state == 'OK'){
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
         template: res.message,
         okType :'button-balanced'
       });
        alertPopup.then(function(res) {
         $state.go('main', {}, {reload:true});
       });
      }
      else {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
         template: res.state,
         okType :'button-assertive'
       });
      }
    })
  }
}
}

// $scope.changepass = function(data){
//   if(!data || !data.newpass || !data.email || !data.newpass_verify){
//    var alertPopup = $ionicPopup.alert({
//      template: 'Талбарыг бөглөнө үү',
//      okType :'button-assertive'
//    });
//  }
//  else {
//   if(data.newpass == data.newpass_verify){
//    $ionicLoading.show({
//     content: 'Loading',
//     animation: 'fade-in',
//   });
//    $http.put('http://www.urilga.mn:1337/user',{email:data.email,password:data.newpass}).success(function (res){
//     if(res.status == true){
//       $ionicLoading.hide();
//       var alertPopup = $ionicPopup.alert({
//        template: 'Амжилттай өөрчлөгдлөө',
//        okType :'button-balanced'
//      });
//       alertPopup.then(function(res) {
//        $state.go('main', {}, {reload:true});
//      });
//     }
//     else {
//       $ionicLoading.hide();
//       var alertPopup = $ionicPopup.alert({
//        template: 'Амжилтгүй',
//        okType :'button-assertive'
//      });
//     }
//   })
//  }
//  else {
//    var alertPopup = $ionicPopup.alert({
//      template: 'Нууц үг тохирохгүй байна',
//      okType :'button-assertive'
//    });
//  }
// }
// };
})

.controller('HomeCtrl',function($scope,$state,$window){
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  }
  $scope.goBack = function(){
    $window.history.back();
  };
})
.controller('eventImgCtrl',function($scope,$ionicPopup,$state,$window,$ionicModal,$http,$localStorage,$stateParams,$ionicSlideBoxDelegate){
  var user_id = $localStorage.userdata.user.person.id;
  $scope.doRefresh = function(){
   $http.get('http://www.urilga.mn:1337/ticket?ticket_transaction_id='+$stateParams.eventId+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.tickets = response;
    $ionicSlideBoxDelegate.update();
  })
 }
 window.onload = $scope.doRefresh();
 $scope.acceptTicket = function(data){
  var mydata = {};
  mydata.id = data.id;
  mydata.ticket_isActive = true;
  mydata.token = 'dXJpbGdhbW5BY2Nlc3M=';
  $http.put('http://www.urilga.mn:1337/ticket/'+mydata.id,mydata).success(function (response){
    $scope.doRefresh();
  })
  console.log('accepted');
}
$scope.deleteTicket = function(data){
  var mydata = {};
  mydata.id = data.id;
  mydata.event_id = data.ticket_event.id;
  mydata.token = 'dXJpbGdhbW5BY2Nlc3M=';
  $http.delete('http://www.urilga.mn:1337/ticket/'+mydata.id+'?____token='+mydata.token).success(function (response){
   console.log('rejected');
   $state.go('app.eventTicketNumber',{playlistId:mydata.event_id},{reload:true})
   $scope.doRefresh();
 })
}
$scope.deleteConfirm = function(data) {
 var confirmPopup = $ionicPopup.confirm({
   cssClass: 'deleteButton',
   cancelText: 'Болих',
   okText: 'Устгах',
   okType: 'button-assertive',
   template: 'Та устгахдаа итгэлтэй байна уу'
 });
 confirmPopup.then(function(res) {
   if(res) {
     $scope.deleteTicket(data);
   } else {
     console.log('You are not sure');
   }
 });
};
$ionicModal.fromTemplateUrl('templates/barcode.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function(modal) {
  $scope.modal = modal;
});
$scope.xaxa = '';
$scope.openModal = function(data) {
  $scope.modal.show();
  $scope.xaxa = data.id;
};

$scope.closeModal = function() {
  $scope.modal.hide();
};

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      console.log('Modal is shown!');
    });
    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    }

    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    }

    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    }
    
    $scope.show = function(data){
      $ionicSlideBoxDelegate.update();
      $scope.openModal();
    }
    $scope.goBack = function(){
      $window.history.back();
    };
  })
.controller('ticketImgCtrl',function($scope,$ionicPopup,$rootScope,$state,$window,$ionicModal,$http,$localStorage,$stateParams,$ionicSlideBoxDelegate){
  var user_id = $localStorage.userdata.user.person.id;
  $scope.size = 500;
  $scope.doRefresh = function(){
   $http.get('http://www.urilga.mn:1337/ticket?ticket_transaction_id='+$stateParams.eventId+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.tickets = response;
    $ionicSlideBoxDelegate.update();
  })
 }
 window.onload = $scope.doRefresh();

 $scope.acceptTicket = function(data){
  var mydata = {};
  mydata.id = data.id;
  mydata.ticket_isActive = true;
  mydata.token = 'dXJpbGdhbW5BY2Nlc3M=';
  $http.put('http://www.urilga.mn:1337/ticket/'+mydata.id,mydata).success(function (response){
    $scope.doRefresh();
  })
  console.log('accepted');
}
$scope.deleteTicket = function(data){
  var mydata = {};
  mydata.id = data.id;
  mydata.token = 'dXJpbGdhbW5BY2Nlc3M=';
  $http.delete('http://www.urilga.mn:1337/ticket/'+mydata.id+'?____token='+mydata.token).success(function (response){
    console.log('rejected');
    $state.go('app.myticket');
    $scope.doRefresh();
  })
  
}
$scope.deleteConfirm = function(data) {
 var confirmPopup = $ionicPopup.confirm({
   cssClass: 'deleteButton',
   cancelText: 'Болих',
   okText: 'Устгах',
   okType: 'button-assertive',
   template: 'Та устгахдаа итгэлтэй байна уу'
 });
 confirmPopup.then(function(res) {
   if(res) {
     $scope.deleteTicket(data);
   } else {
     console.log('You are not sure');
   }
 });
};

$ionicModal.fromTemplateUrl('templates/barcode.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function(modal) {
  $scope.modal = modal;
});
$scope.xaxa = '';
$scope.openModal = function(data) {
  $scope.modal.show();
  $scope.xaxa = data.id;
};

$scope.closeModal = function() {
  $scope.modal.hide();
};

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      console.log('Modal is shown!');
    });
    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    }

    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    }

    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    }
    
    $scope.show = function(data){
      $ionicSlideBoxDelegate.update();
      $scope.openModal();
    }
    $scope.goBack = function(){
      $window.history.back();
    };
  })
.controller('buyticketImgCtrl',function($scope,$ionicPopup,$state,$window,$ionicModal,$http,$localStorage,$stateParams,$ionicSlideBoxDelegate){
  var user_id = $localStorage.userdata.user.person.id;
  $scope.doRefresh = function(){
   $http.get('http://www.urilga.mn:1337/ticket?ticket_transaction_id='+$stateParams.eventId+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.tickets = response;
    $ionicSlideBoxDelegate.update();
  })
 }
 window.onload = $scope.doRefresh();
 $scope.deleteTicket = function(data){
  var mydata = {};
  mydata.id = data.id;
  mydata.token = 'dXJpbGdhbW5BY2Nlc3M=';
  $http.delete('http://www.urilga.mn:1337/ticket/'+mydata.id+'?____token='+mydata.token).success(function (response){
    console.log('rejected');
    $state.go('app.myticket');
    $scope.doRefresh();
  })
  
}
$scope.deleteConfirm = function(data) {
 var confirmPopup = $ionicPopup.confirm({
   cssClass: 'deleteButton',
   cancelText: 'Болих',
   okText: 'Устгах',
   okType: 'button-assertive',
   template: 'Та устгахдаа итгэлтэй байна уу'
 });
 confirmPopup.then(function(res) {
   if(res) {
     $scope.deleteTicket(data);
   } else {
     console.log('You are not sure');
   }
 });
};
$ionicModal.fromTemplateUrl('templates/barcode.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function(modal) {
  $scope.modal = modal;
});
$scope.xaxa = "";
$scope.openModal = function(data) {
  $scope.modal.show();
  $scope.xaxa = data.id;
};

$scope.closeModal = function() {
  $scope.modal.hide();
};

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      console.log('Modal is shown!');
    });
    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    }

    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    }

    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    }
    
    $scope.show = function(data){
      $ionicSlideBoxDelegate.update();
      $scope.openModal();
    }
    $scope.goBack = function(){
      $state.go('app.playlists');
    };
  })
.controller('PlaylistCtrl', function($scope,$state,$interval,$ionicHistory,$ionicLoading,onlineStatus,$cordovaSocialSharing,$stateParams,$timeout,$ionicLoading,$http,$localStorage,$ionicPopup,$ionicModal,$window) {
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
  }); 
  $scope.showHeader = function(){
    $('#header').fadeOut();
  };

  $scope.hideHeader =function(){
    $('#header').fadeIn();
  }
  if(onlineStatus.onLine ==true){
   $http.get("http://www.urilga.mn:1337/event/"+$stateParams.playlistId+'?____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response) {
    $scope.list = response;
    $http.get("http://www.urilga.mn:1337/agenda?agenda_event="+$scope.list.id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
     if(response.length > 0){
      $scope.agendas = response;
      $ionicLoading.hide();
    }
    else {
      $scope.message = 'Хөтөлбөрийн мэдээлэл ороогүй байна';
      $ionicLoading.hide();
      $scope.loader = {loading: true};
    }
  });
  }).error(function (data, status, headers, config){
    if(status == '404'){
      $ionicLoading.hide();
      $state.go('app.playlists', {}, {reload:true});
    }
  })
}
else {
 $ionicLoading.hide();
 var alertPopup = $ionicPopup.alert({
   template: 'Интернет холболтоо шалгана уу',
   okType :'button-assertive'
 });


}
function checkAll() {
  $http.get("http://www.urilga.mn:1337/eventlike?event_info="+$stateParams.playlistId+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.eventlike = response;
  })
  $http.get("http://www.urilga.mn:1337/ticket?ticket_event="+$stateParams.playlistId+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.going = response;
  })
  $http.get("http://www.urilga.mn:1337/eventjoiner?ticket_info="+$stateParams.playlistId+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.maybe = response;
  })
  $http.get("http://www.urilga.mn:1337/eventsub?event_info="+$stateParams.playlistId+
    "&status=interested"+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
      $scope.interested = response;
    })
  }
  $interval(function(){
    checkAll();
  },1000);

  $scope.loader = {
    loading : false,
  };
  $scope.agenda_times = function(id){
    $http.get("http://www.urilga.mn:1337/agendatime?time_agenda="+id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
      if(response.length > 0){
        $scope.agenda_times = response;
        $scope.loader = {loading: true};
      }
      else {
        $scope.loader = {loading: true};
      }
    })
  }

  $scope.shareAnywhere = function() {
    $cordovaSocialSharing.share($scope.list.event_title, null, null, 'http://www.urilga.mn/#/event_details/'+$scope.list.id);
  };


  $ionicModal.fromTemplateUrl('templates/image-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      console.log('Modal is shown!');
    });

    $scope.imageSrc = 'img/slideimg.jpg';

    $scope.showImage = function(){
      $scope.imageSrc = 'http://www.urilga.mn:1337/'+$scope.list.event_cover;
      $scope.openModal();
    }
    $scope.goBack = function(){
      $ionicHistory.goBack();
    };
    var person_id = $localStorage.userdata.user.person.id;

    function checkTicket() {
      var event_id = $stateParams.playlistId;
      $http.get('http://www.urilga.mn:1337/ticket?ticket_type=Paid&ticket_type=Free&ticket_user='+person_id+'&ticket_event='+event_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
        if(response.length>0){
         $scope.checkTicket = response;
         $scope.check = 1;
       }
       else {
        console.log('alga');
      }
    })
    };


    
    function checkLike() {
     var event_id = $stateParams.playlistId;
     $http.get("http://www.urilga.mn:1337/eventlike?event_info="+event_id+"&liked_by="+person_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response) {
      if(response.length>0) {
        $scope.liker_function = 1;
      }        
      else {
        $scope.liker_function = 0;
      }
    })
   };

 //   $scope.checkJoin = function(){
 //    var event_id =$stateParams.playlistId;
 //    $http.get("http://www.urilga.mn:1337/eventjoin?event_info="+event_id+"&joined_by="+person_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
 //      if(response.length>0){
 //        $scope.join_value = 1;
 //      }
 //      else {
 //        $scope.join_value = 0;
 //      }
 //    })
 //  }

 //  $scope.joinEvent = function(){
 //    var event_id = $stateParams.playlistId;
 //    var person_id = $localStorage.userdata.user.person.id;
 //    $http.post("http://www.urilga.mn:1337/eventjoin",{event_info:event_id,joined_by:person_id}).success(function (response){
 //      console.log('success');
 //      $scope.join_value = 1;
 //    })
 //  }

 //  $scope.unjoinEvent = function(){
 //   var event_id = $stateParams.playlistId;
 //   $http.get("http://www.urilga.mn:1337/eventjoin?event_info="+event_id+"&joined_by="+person_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
 //    var id = response[0].id;
 //    $http.delete("http://www.urilga.mn:1337/eventjoin/"+id).success(function (response){
 //      if(response.state == 'OK'){
 //        console.log('deleted');
 //        $scope.join_value = 0;
 //      }
 //    })
 //  })
 // }

 $scope.unlikeEvent = function(){
  var event_id = $stateParams.playlistId;
  $http.get("http://www.urilga.mn:1337/eventlike?event_info="+event_id+"&liked_by="+person_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response) {
   var id = response[0].id;
   var token = 'dXJpbGdhbW5BY2Nlc3M=';
   $http.delete("http://www.urilga.mn:1337/eventlike/"+id+"?____token="+token).success(function (response){
    if(response.state == 'OK'){
      console.log('deleted');
      $scope.liker_function = 0;
    }
  })
 });
} ;
$scope.likeEvent = function(){
  var person_id = $localStorage.userdata.user.person.id;
  var token = 'dXJpbGdhbW5BY2Nlc3M=';
  $http.post("http://www.urilga.mn:1337/eventlike",{____token:token,event_info:$scope.list.id,liked_by:person_id}).success(function (response){
    console.log('success');
    $scope.liker_function=1;
  });
} 
$interval(function(){
  checkTicket();
  checkLike();
},1000);

})


;

