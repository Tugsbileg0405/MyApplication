var myapp = angular.module('starter.controllers', ['ngCordova'])

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
}
$scope.left = function(){
 $ionicSideMenuDelegate.toggleLeft();
}
checkAll();
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
  $state.go('main', {}, {reload:true});
  $ionicLoading.hide();
  $window.location.reload();
},2000);
};
})

.controller('changePassCtrl',function($scope,$ionicHistory,$ionicPopup,$ionicLoading,$http,$state,$localStorage){
  $scope.goBack = function(){
    $ionicHistory.goBack();
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

.controller('PlaylistsCtrl', function($window,$resource,myData,$cacheFactory,$ionicModal,ImgCache,$rootScope,$cacheFactory,$ionicSideMenuDelegate,$scope,onlineStatus,$rootScope,$ionicPopup,$cordovaNetwork,$timeout,$http,$ionicLoading,$localStorage,$ionicScrollDelegate) {
 $scope.onlineStatus = onlineStatus;
 $scope.limit = 5;
$http.get("http://www.urilga.mn:1337/category?____token=dXJpbGdhbW5BY2Nlc3M=").success(function (res){
  $localStorage.categoryEvent = res;
})
$scope.doRefresh = function(){
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in'
  });
    $http.get('http://www.urilga.mn:1337/todayevents?____token=dXJpbGdhbW5BY2Nlc3M=').success(function(response){
      $ionicLoading.hide();
      $scope.today = [];
      angular.forEach(response,function(event){
        var mydata = {};
        event.event_isLiked = false;
        mydata.event_info = event.id;
        mydata.liked_by = $localStorage.userdata.user.person.id;
        $http.get('http://www.urilga.mn:1337/eventlike?liked_by='+mydata.liked_by+'&event_info='+mydata.event_info+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function(res){
          if(res.length > 0){
            event.event_isLiked = true;
          }
        })
        $scope.today.push(event);
      })
      $scope.today_event = $scope.today;
      $localStorage.today_event = $scope.today;
    }).finally(function(){
     ImgCache.$init();
     $scope.$broadcast('scroll.refreshComplete');
   })
    $http.get('http://www.urilga.mn:1337/tomorrowevents?____token=dXJpbGdhbW5BY2Nlc3M=').success(function(response){
      $ionicLoading.hide();
      $scope.tomorrow = [];
      angular.forEach(response,function(event){
        event.event_isLiked = false;
        var person_id = $localStorage.userdata.user.person.id;
        $http.get('http://www.urilga.mn:1337/eventlike?liked_by='+person_id+'&event_info='+event.id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function(res){
          if(res.length > 0) {
            event.event_isLiked = true;
          }
        })
        $scope.tomorrow.push(event);
      })
      $scope.tomorrow_event = $scope.tomorrow;
      $localStorage.tomorrow_event = $scope.tomorrow;
    }).finally(function(){
     ImgCache.$init();
     $scope.$broadcast('scroll.refreshComplete');
   })
    $http.get('http://www.urilga.mn:1337/findevent?____token=dXJpbGdhbW5BY2Nlc3M=').success(function(response){
      $ionicLoading.hide();
      $scope.top = [];
      angular.forEach(response,function(event){
        event.event_isLiked = false;
        var person_id = $localStorage.userdata.user.person.id;
        $http.get('http://www.urilga.mn:1337/eventlike?liked_by='+person_id+'&event_info='+event.id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function(res){
          if(res.length > 0) {
            event.event_isLiked = true;
          }
        })
        $scope.top.push(event);
      })
       $scope.lists = $scope.top;
      $localStorage.lists = $scope.top;
    })
    .finally(function(){
     ImgCache.$init();
     $scope.$broadcast('scroll.refreshComplete');
   })
}
$window.onload = $scope.doRefresh();
if($scope.onlineStatus.onLine == false){
  $scope.today_event = $localStorage.today_event;
  $scope.tomorrow_event = $localStorage.tomorrow_event;
  $scope.lists = $localStorage.lists;
  $ionicLoading.hide();
  var alertPopup = $ionicPopup.alert({
   okType :'button-assertive',
   template: 'Интернет холболтоо шалгана уу'
 });
  alertPopup.then(function(res) {
   $scope.$broadcast('scroll.refreshComplete');
 });
}
var i=1; 
$scope.loadMore = function() {
  i=i+1;
  $http.get('http://www.urilga.mn:1337/findevent?page_number='+i+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function(res){
    angular.forEach(res,function(item){
      item.event_isLiked = false;
      var person_id =$localStorage.userdata.user.person.id;
      $http.get('http://www.urilga.mn:1337/eventlike?liked_by='+person_id+'&event_info='+item.id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function(res){
        if(res.length > 0){
          item.event_isLiked = true;
        }
      })
      $scope.lists.push(item);
    })
    $ionicLoading.hide();
    $scope.$broadcast('scroll.infiniteScrollComplete');
  })
}

$scope.toggleLeftSideMenu = function() {
  $ionicSideMenuDelegate.toggleLeft();
};
$scope.clear = function(){
  $scope.search = '';
}

$scope.index = 0;
$scope.buttonClicked = function(index){
  $scope.index = index;
  if($scope.index == 0){
   $http.get('http://www.urilga.mn:1337/todayevents?____token=dXJpbGdhbW5BY2Nlc3M=').success(function(response){
    $ionicLoading.hide();
    $scope.today = [];
    angular.forEach(response,function(event){
      var mydata = {};
      event.event_isLiked = false;
      mydata.event_info = event.id;
      mydata.liked_by = $localStorage.userdata.user.person.id;
      $http.get('http://www.urilga.mn:1337/eventlike?liked_by='+mydata.liked_by+'&event_info='+mydata.event_info+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function(res){
        if(res.length > 0){
          event.event_isLiked = true;
        }
      })
      $scope.today.push(event);
    })
  $scope.today_event = $scope.today;
  })
 }
if ($scope.index == 1){
  $http.get('http://www.urilga.mn:1337/tomorrowevents?____token=dXJpbGdhbW5BY2Nlc3M=').success(function(response){
    $ionicLoading.hide();
    $scope.tomorrow = [];
    angular.forEach(response,function(event){
      event.event_isLiked = false;
      var person_id = $localStorage.userdata.user.person.id;
      $http.get('http://www.urilga.mn:1337/eventlike?liked_by='+person_id+'&event_info='+event.id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function(res){
        if(res.length > 0) {
          event.event_isLiked = true;
        }
      })
      $scope.tomorrow.push(event);
    })
    $scope.tomorrow_event = $scope.tomorrow;
  })
}
if($scope.index == 2) {
 $http.get('http://www.urilga.mn:1337/findevent?____token=dXJpbGdhbW5BY2Nlc3M=').success(function(response){
  $ionicLoading.hide();
  $scope.top = [];
  angular.forEach(response,function(event){
    event.event_isLiked = false;
    var person_id = $localStorage.userdata.user.person.id;
    $http.get('http://www.urilga.mn:1337/eventlike?liked_by='+person_id+'&event_info='+event.id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function(res){
      if(res.length > 0) {
        event.event_isLiked = true;
      }
    })
    $scope.top.push(event);
  })
  $scope.lists = $scope.top;
})
}
$scope.$apply();
}
$scope.slideChanged = function(index) {
  $scope.slideIndex = index;
}
$scope.scrollTop = function() {
  $ionicScrollDelegate.scrollTop();
};

$scope.likeEvent = function(data){
  var mydata = {};
  mydata.event_info = data.id;
  mydata.liked_by = $localStorage.userdata.user.person.id;
  mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
  $http.post('http://www.urilga.mn:1337/eventlike',mydata).success(function (res){
    console.log('amjilttai');
  })
  data.event_isLiked = true;
}
$scope.unlikeEvent = function(data){
  var event_id = data.id;
  var person_id = $localStorage.userdata.user.person.id;
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
  data.event_isLiked = false;
}
$ionicModal.fromTemplateUrl('templates/suggest.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function(smodal) {
  $scope.suggestmodal = smodal;
});

$scope.suggest = function(data) {
  $scope.list = data;
  $scope.suggestmodal.show();
};
$scope.suggestclose = function() {
  $scope.suggestmodal.hide();
};
$scope.suggestPerson = function(data){
 if(!data){
  var alertPopup = $ionicPopup.alert({
    okType: 'button-assertive',
    template: 'Талбарын утгыг бөглөнө үү'
  });
}
else {
  if(isNaN(data.info)){
    var invitedata = {};
    invitedata.email = data.info;
    invitedata.event = $scope.list.id;
    invitedata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in'
    });
    myData.eventInviteByEmail(invitedata).success(function (res){
      if(res){
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          okType: 'button-balanced',
          template: 'Амжилттай илгээлээ'
        })
        alertPopup.then(function(res) {
          $scope.suggestclose();
        });
      }
      else {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          okType: 'button-assertive',
          template: 'Амжилтгүй'
        });
      }
    })
    .error(function(err){
      $ionicLoading.hide();
    })
  }
  else {
    var invitedata = {};
    invitedata.phonenumber = data.info;
    invitedata.event = $scope.list.id;
    invitedata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in'
    });
    myData.eventInviteByPhone(invitedata).success(function (res){
      if(res){
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          okType: 'button-balanced',
          template: 'Амжилттай илгээлээ'
        })
        alertPopup.then(function(res) {
          $scope.suggestclose();
        });
      }
      else {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          okType: 'button-assertive',
          template: 'Амжилтгүй'
        });
      }
    })
    .error(function(err){
      $ionicLoading.hide();
      console.log(err);
    })
  }
}
}
})

.controller('ProfileCtrl',function($scope,$state,$ionicLoading,onlineStatus,$ionicPopup,$http,$localStorage,$window,$state,$timeout){
  $scope.goBack = function(){
    $state.go('app.playlists',{},{reload:true});
  };
  var user_id =  $localStorage.userdata.user.person.id;
  $scope.user = $localStorage.userdata.user.person;
  //  $ionicLoading.show({
  //   content: 'Loading',
  //   animation: 'fade-in'
  // });
  // $http.get('http://www.urilga.mn:1337/person/'+user_id+'?____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
  //   $ionicLoading.hide();
  //   $scope.user =response;
  //   console.log(response);
  // })
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

.controller('buyTicketCtrl',function($scope,$ionicHistory,$cordovaToast,onlineStatus,$localStorage,$stateParams,$http,$window,$state,$timeout,$ionicLoading,$ionicPopup){
  // $scope.events = $localStorage.events.all;
  // angular.forEach($scope.events, function(event){
  //   if(event.id == $stateParams.playlistId){
  //     $scope.event_info = event;
  //     $scope.event_ticket = {};
  //     $scope.event_ticket.free = [];
  //     $scope.event_ticket.paid = [];
  //     $scope.event_ticket.urilga = [];
  //     $scope.myevent = false;
  //     if($scope.event_info.event_created_by.id == $localStorage.userdata.user.person.id){
  //       $scope.myevent = true
  //     }
  //     angular.forEach(event.event_ticket_types,function(item){
  //       if(item.type == "Paid"){
  //         $scope.event_ticket.paid.push(item);
  //       }
  //       if(item.type == "Free"){
  //         $scope.event_ticket.free.push(item);
  //       }
  //       if(item.type == "Urilga"){
  //         $scope.event_ticket.urilga.push(item);
  //       }
  //     });
  //   }
  // })
$scope.myevent = false;
$http.get('http://www.urilga.mn:1337/event/'+$stateParams.playlistId).success(function(res){
  $scope.event_info = res;
  $scope.event_ticket = {};
  $scope.event_ticket.free = [];
  $scope.event_ticket.paid = [];
  $scope.event_ticket.urilga = [];
  if($scope.event_info.event_created_by.id == $localStorage.userdata.user.person.id){
   $scope.myevent = true;
 }
 angular.forEach(res.event_ticket_types,function(item){
  if(item.type == "Paid"){
    $scope.event_ticket.paid.push(item);
  }
  if(item.type == "Free"){
    $scope.event_ticket.free.push(item);
  }
  if(item.type == "Urilga"){
    $scope.event_ticket.urilga.push(item);
  }
})
}).finally(function(){
  $ionicLoading.hide();
})
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
$scope.isChecked = {checked: true};
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
$window.onload = $scope.check();


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
  $ionicHistory.goBack();
};
})


.controller('myEventCtrl',function($scope,ImgCache,$localStorage,$interval,$ionicPopup,onlineStatus,$ionicLoading,$http,$window,$state,$timeout){



 $scope.makePrivate = function(data){
  var mydata = {};
  mydata.id = data.id;
  mydata.event_isActive = false;
  mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
  $http.put('http://www.urilga.mn:1337/event',mydata).success(function (res){
    if(res.status == true){
      console.log('amjilttai');
      $scope.doRefresh();
    }
  })
}
$scope.makePublic = function(data){
 var mydata = {};
 mydata.id = data.id;
 mydata.event_isActive = true;
 mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
 $http.put('http://www.urilga.mn:1337/event',mydata).success(function (res){
  if(res.status == true){
    console.log('amjilttai');
    $scope.doRefresh();
  }
})
}
$ionicLoading.show({
  content: 'Loading',
  animation: 'fade-in'
});
var user_id = $localStorage.userdata.user.person.id;
$scope.onlineStatus = onlineStatus;
$scope.doRefresh = function(){
  if($scope.onlineStatus.onLine == true){
   $http.get('http://www.urilga.mn:1337/event?event_created_by='+user_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.myEvents = response;
    $localStorage.myEvents = response;
  }).finally(function(){
   ImgCache.$init();
   $scope.$broadcast('scroll.refreshComplete');
   $ionicLoading.hide();
 })
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
  if($localStorage.myEvents){
    $scope.myEvents = $localStorage.myEvents;
    $ionicLoading.hide();
    $scope.doRefresh();
  }
  else {
    $scope.doRefresh();
  }
}
$window.onload = $scope.onLoad();
$scope.limit = 5;
$scope.loadMoreData = function() {
 if($localStorage.myEvents.length > 5){
  // if($scope.myEvents.length > 5){ 
    $scope.limit += 5;
    $scope.$broadcast('scroll.infiniteScrollComplete');
  }
}

 $scope.showConfirm = function(data) {
   var confirmPopup = $ionicPopup.confirm({
     okType: 'button-assertive',
     okText: 'Тийм',
     cancelText: 'Үгүй',
     template: 'Арга хэмжээг устгахдаа итгэлтэй байна уу?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       var mydata = {};
       mydata.id = data.id;
       mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
       $http.delete('http://www.urilga.mn:1337/event/'+data.id+'?____token=dXJpbGdhbW5BY2Nlc3M=').success(function(res){
        if(res.state == 'OK'){
          $scope.doRefresh();
        }
       })
     } else {
       console.log('You are not sure');
     }
   });
 };


$scope.goBack = function(){
  $state.go('app.playlists');
};
})

.controller('myOrgCtrl',function($scope,ImgCache,$ionicHistory,$state,$interval,$localStorage,$ionicPopup,onlineStatus,$ionicLoading,$http,$window,$state,$timeout){
 $ionicLoading.show({
  content: 'Loading',
  animation: 'fade-in'
});
 var user_id = $localStorage.userdata.user.person.id;
 $scope.onlineStatus = onlineStatus;
 $scope.doRefresh = function(){
  if($scope.onlineStatus.onLine == true){
    $timeout(function(){
     $http.get('http://www.urilga.mn:1337/org?organization_created_by='+user_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
      $scope.myOrgs = response;
      $localStorage.myOrgs = response;
      $ionicLoading.hide();
    })
     ImgCache.$init();
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
  if($localStorage.myOrgs){
    $scope.myOrgs = $localStorage.myOrgs;
    $ionicLoading.hide();
    $scope.doRefresh();
  }
  else {
    $scope.doRefresh();
  }
}
window.onload = $scope.onLoad();
$scope.limit = 5;
$scope.loadMoreData = function() {
 if($localStorage.myOrgs.length > 5){
  $scope.limit += 5;
  $scope.$broadcast('scroll.infiniteScrollComplete');
}
}
$scope.goBack = function(){
  $state.go('app.playlists');
};
})

.controller('OrgCtrl',function($scope,$ionicHistory,$localStorage,onlineStatus,$ionicPopup,$ionicLoading,$http,$window,$state,$timeout,$stateParams){
 $ionicLoading.show({
  content: 'Loading',
  animation: 'fade-in'
});
 var orgs = $localStorage.myOrgs;
 angular.forEach(orgs,function(org){
  if(org.id == $stateParams.myOrgId){
    $scope.org = org;
    $ionicLoading.hide();
  }
})
//  $http.get('http://www.urilga.mn:1337/org/'+$stateParams.myOrgId+'?____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
//   $scope.org = response;
//   $ionicLoading.hide();
// });

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
  $ionicHistory.goBack();
};
})

.controller('CategoryItemCtrl', function($ionicPopover,$ionicModal,myData,ImgCache,$rootScope,$scope,$state,$ionicLoading,onlineStatus,$localStorage,$ionicPopup,$timeout,$http,$stateParams,$window) {     

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
$scope.sortReverse  =  true;

$scope.sortName = [
{ text:"A-Z",name: "downName", icon: 'fa-sort-alpha-asc'},
{ text:"Z-A",name: "upName", icon: 'fa-sort-alpha-desc'}
];
$scope.sortType = [
{ text:"Бүх арга хэмжээ", eventType: "all"},
{ text:"Үнэгүй", eventType: "free"},
{ text:"Төлбөртэй", eventType: "paid"}
];
$scope.sortDate = [
{text:"Орсон өдөр", dateType: "createDate"},
{text:"Эхлэх хугацаа", dateType: "orderDate"}
];
$scope.sortByType = function(data){
  delete data.name;
  if(data.eventType == 'free'){
    $scope.events = $localStorage.eventType.free;
  }
  else if(data.eventType == 'paid'){
    $scope.events = $localStorage.eventType.paid;
  }
  else if(data.eventType == 'all'){
    var all = [];
    all =  $localStorage.eventType.free.concat($localStorage.eventType.paid);
    $scope.events = all;
  }
  $scope.hidePop();
}
$scope.sortByName = function(data){
  delete data.eventType;
  if(data.name == 'downName'){
    $scope.sortType = 'event_title';
    $scope.sortReverse = false;
  }
  else if (data.name == 'upName'){
    $scope.sortType = 'event_title';
    $scope.sortReverse = true;
  }
  $scope.hidePop();
}
$scope.sortByDate = function(data){
  delete data.eventType;
  delete data.name;
  if(data.dateType == 'createDate'){
    $scope.sortType = 'createdAt';
    $scope.sortReverse = true;
  }
  else if (data.dateType== 'orderDate'){
    $scope.sortType = 'event_start_date';
    $scope.sortReverse = true;
  }
  $scope.hidePop();
}
$ionicLoading.show({
  content: 'Loading',
  animation: 'fade-in'
});
$scope.eventid = $stateParams.category_Id;
$scope.onlineStatus = onlineStatus;
$scope.doRefresh = function(){
  if($scope.onlineStatus.onLine == true){
    $timeout(function(){
      $http.get('http://www.urilga.mn:1337/category?____token=dXJpbGdhbW5BY2Nlc3M=').success(function(res){
        $localStorage.categoryEvent = res;
      })
      ImgCache.$init();
      $scope.$broadcast('scroll.refreshComplete');
    },1000);
  }
}
$scope.onLoad = function(){
  if($localStorage.categoryEvent){
    angular.forEach($localStorage.categoryEvent,function(category){
      if(category.id == $stateParams.category_Id){
        $scope.items = category;
        var result = category.events;
        $scope.events = [];
        var eventType = {};
        eventType.free = [];
        eventType.paid = [];
        angular.forEach(result,function(event){
          event.event_isLiked = false;
          if(event.event_isActive == true){
            $scope.events.push(event);
          }
          if(event.event_ticket_type == 'Paid'){
            eventType.paid.push(event);
          }
          else if (event.event_ticket_type == 'Free'){
            eventType.free.push(event)
          }
          $localStorage.eventType = eventType;
        //   var person_id =  $localStorage.userdata.user.person.id;
        //   $http.get('http://www.urilga.mn:1337/eventlike?liked_by='+person_id+'&event_info='+event.id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function(res){
        //     if(res.length > 0){
        //       event.event_isLiked = true;
        //     }
        //   })
        //   $scope.events.push(event);
        })
        $ionicLoading.hide();
      }
    })  
  }
  else {
    $scope.doRefresh();
    $ionicLoading.hide();
  }
}
$window.onload = $scope.onLoad();
$scope.limit = 5;
$scope.loadMore = function() {
 if($scope.events.length > 5){
  $scope.limit += 5;
  $scope.$broadcast('scroll.infiniteScrollComplete');
  ImgCache.$init();
}
}
$scope.goBack = function(){
  $state.go('app.playlists');
};


$scope.likeEvent = function(data){
  var mydata = {};
  mydata.event_info = data.id;
  mydata.liked_by = $localStorage.userdata.user.person.id;
  mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
  $http.post('http://www.urilga.mn:1337/eventlike',mydata).success(function (res){
    console.log('amjilttai');
  })
  $scope.event_isLiked = true;
}
$scope.unlikeEvent = function(data){
  var event_id = data.id;
  var person_id = $localStorage.userdata.user.person.id;
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
  $scope.event_isLiked = false;
}
$ionicModal.fromTemplateUrl('templates/suggest.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function(smodal) {
  $scope.suggestmodal = smodal;
});

$scope.suggest = function(data) {
  $scope.list = data;
  $scope.suggestmodal.show();
};
$scope.suggestclose = function() {
  $scope.suggestmodal.hide();
};
$scope.suggestPerson = function(data){
 if(!data){
  var alertPopup = $ionicPopup.alert({
    okType: 'button-assertive',
    template: 'Талбарын утгыг бөглөнө үү'
  });
}
else {
  if(isNaN(data.info)){
    var invitedata = {};
    invitedata.email = data.info;
    invitedata.event = $scope.list.id;
    invitedata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in'
    });
    myData.eventInviteByEmail(invitedata).success(function (res){
      if(res){
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          okType: 'button-balanced',
          template: 'Амжилттай илгээлээ'
        })
        alertPopup.then(function(res) {
          $scope.suggestclose();
        });
      }
      else {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          okType: 'button-assertive',
          template: 'Амжилтгүй'
        });
      }
    })
    .error(function(err){
      $ionicLoading.hide();
    })
  }
  else {
    var invitedata = {};
    invitedata.phonenumber = data.info;
    invitedata.event = $scope.list.id;
    invitedata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in'
    });
    myData.eventInviteByPhone(invitedata).success(function (res){
      if(res){
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          okType: 'button-balanced',
          template: 'Амжилттай илгээлээ'
        })
        alertPopup.then(function(res) {
          $scope.suggestclose();
        });
      }
      else {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          okType: 'button-assertive',
          template: 'Амжилтгүй'
        });
      }
    })
    .error(function(err){
      $ionicLoading.hide();
      console.log(err);
    })
  }
}
}

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
  $http.get('http://www.urilga.mn:1337/eventsearch?query='+data+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
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

.controller('InvitationCtrl', function($scope,$state,$ionicHistory,$interval,$rootScope,$ionicLoading,$ionicPopup,onlineStatus,$timeout,$http,$stateParams,$localStorage,$ionicModal,$ionicSlideBoxDelegate,$window) {


 $scope.goBack = function(){
  $state.go('app.playlists');
}
$ionicLoading.show({
  content: 'Loading',
  animation: 'fade-in'
}); 
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
     $scope.$broadcast('scroll.refreshComplete');
   },1000);
  }
  else {
    $ionicLoading.hide();
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
  if($localStorage.urilga){
    $scope.uriga = $localStorage.urilga;
    $ionicLoading.hide();
    $scope.doRefresh();
  }
  else {
    $scope.doRefresh();
  }
}
$window.onload = $scope.onLoad();

  })

.controller('TicketCtrl',function($scope,ImgCache,$state,$ionicHistory,$interval,$localStorage,$ionicPopup,onlineStatus,$ionicLoading,$state,$ionicSlideBoxDelegate,$localStorage,$http,$timeout,$window){



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
$ionicLoading.show({
  content: 'Loading',
  animation: 'fade-in'
}); 
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
     ImgCache.$init();
     $scope.$broadcast('scroll.refreshComplete');
   },1000);
  }
  else {
    $ionicLoading.hide();
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
  if($localStorage.tickets){
    $scope.tickets = $localStorage.tickets;
    $scope.doRefresh();
    $ionicLoading.hide();
  }
  else {
    $scope.doRefresh();
  }
}

$window.onload = $scope.onload();
$scope.goBack = function(){
  $ionicHistory.goBack();
};

})

.controller('ticketNumberCtrl', function($scope,ImgCache,$ionicHistory,$http,$ionicLoading,$stateParams,$localStorage,$timeout,$window) {

  $scope.goBack = function(){
    $ionicHistory.goBack();
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
  $ionicLoading.show({
   content: 'Loading',
   animation: 'fade-in'
 })
  var user_id = $localStorage.userdata.user.person.id;
  $scope.doRefresh = function() {
   $http.get('http://www.urilga.mn:1337/ticket?ticket_type=Paid&ticket_type=Free&ticket_user='+user_id+'&ticket_event='+$scope.eventid+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.TicketOfEvent = response;
    $ionicLoading.hide();
  }).finally(function(){
    ImgCache.$init();
    $scope.$broadcast('scroll.refreshComplete'); 
  })
}
window.onload = $scope.doRefresh();
})

.controller('MainCtrl',function($scope,$cordovaOauth ,myData,onlineStatus ,$state,$ionicPopup,$localStorage,$http,$ionicLoading,$window,$timeout){

  $scope.facebookLogin = function() {
   $cordovaOauth.facebook("832500260195628", ["email","user_events"]).then(function (result) {
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
       animation: 'fade-in',
       showBackdrop: true,
       maxWidth: 200,
       showDelay: 0
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

.controller('SavedItemCtrl',function($timeout,ImgCache,$interval,$localStorage,$ionicHistory,$scope,$state,onlineStatus,$ionicPopup,$ionicLoading,$localStorage,$http,$stateParams,$window){

  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in'
  });
  var person_id = $localStorage.userdata.user.person.id;
  $scope.onlineStatus = onlineStatus;
  $scope.doRefresh = function() {
    if($scope.onlineStatus.onLine == true){
      $timeout (function(){
        $http.get("http://www.urilga.mn:1337/eventlike?liked_by="+person_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
          $scope.likedEvent = response;
          // $localStorage.savedEvents = $scope.likedEvent;
        })
        ImgCache.$init();
        $scope.$broadcast('scroll.refreshComplete');
        $ionicLoading.hide();
      },1000);
    }
    else {
      $ionicLoading.hide();
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
    if($localStorage.savedEvents){
      $ionicLoading.hide();
      $scope.likedEvent = $localStorage.savedEvents;
      $scope.doRefresh();
    }
    else {
      $scope.doRefresh();
    }
  }
  $window.onload = $scope.doRefresh();

  $scope.goBack = function(){
    $state.go('app.playlists');
  }

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



.controller('RegCtrl',function($scope,$ionicLoading,$ionicHistory,$localStorage,myData,$state,$cordovaCamera,$ionicPopover,onlineStatus,$cordovaCamera,$cordovaToast,$ionicPopup,$http,$window){

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
    $ionicHistory.goBack();
  }
  $scope.onlineStatus = onlineStatus;
  $scope.Register = function(data) {
    if($scope.onlineStatus.onLine == true){
      if (!data  || !data.uname || !data.pass || !data.email || !data.phone ) {
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
      $http.post("http://www.urilga.mn:1337/person", {____token:data.token,person_firstname:data.uname,person_email:data.email,person_cell_number:data.phone,person_profile_img:$scope.pictureURL}).success(function (response) {
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
              $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
              }); 
              var logindata = {};
              logindata.email = data.email;
              logindata.pass = data.pass;
              myData.login(logindata).success(function (res){
                if(res.status == true){
                  $localStorage.userdata = res;
                  $state.go('app.playlists',{},{reload:true});
                }
                else {
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                    template: res.message,
                    okType :'button-assertive'
                  });
                }
              })
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

.controller('ForgotPasswordCtrl',function($scope,$ionicHistory,$state,$ionicLoading,$ionicPopup,$state,$window,$http){
  $scope.goBack = function(){
    $ionicHistory.goBack();
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

.controller('HomeCtrl',function($scope,$ionicHistory,$state,$window){
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  }
  $scope.goBack = function(){
    $ionicHistory.goBack();
  };
})
.controller('eventImgCtrl',function($scope,$ionicHistory,$ionicPopup,$state,$window,$ionicModal,$http,$localStorage,$stateParams,$ionicSlideBoxDelegate){
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
      $ionicHistory.goBack();
    };
  })
.controller('ticketImgCtrl',function($scope,ImgCache,$interval,$ionicHistory,$ionicPopup,$rootScope,$state,$window,$ionicModal,$http,$localStorage,$stateParams,$ionicSlideBoxDelegate){
  var user_id = $localStorage.userdata.user.person.id;
  $scope.size = 500;
  $scope.doRefresh = function(){
   $http.get('http://www.urilga.mn:1337/ticket?ticket_transaction_id='+$stateParams.eventId+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.tickets = response;
    $ionicSlideBoxDelegate.update();
  })
 }
 $window.onload = $scope.doRefresh();
 $interval(function(){
  $ionicSlideBoxDelegate.update();
},1000);
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
$scope.new = function(data){
  var mydata = {};
  mydata = data;
  mydata.ticket_isUsed = true;
  mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
  $http.put('http://www.urilga.mn:1337/ticket',mydata).success(function(res){
    console.log(res);
  })
}
$scope.used = function(data){
  var mydata = {};
  mydata = data;
  mydata.ticket_isUsed = false;
  mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
  $http.put('http://www.urilga.mn:1337/ticket',mydata).success(function(res){
    console.log(res);
  })
}
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
      $ionicHistory.goBack();
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
.controller('PlaylistCtrl', function($scope,$rootScope,$localStorage,SlotVote,$state,myData,$interval,$ionicHistory,$ionicLoading,onlineStatus,$cordovaSocialSharing,$stateParams,$timeout,$ionicLoading,$http,$localStorage,$ionicPopup,$ionicModal,$window) {

  $scope.loader = {
    loading : false,
  };
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
  }); 
  // var events = $localStorage.events.all;
  // angular.forEach(events , function(event){
  //   if(event.id == $stateParams.playlistId){
  //     $scope.list = event;
  //     $ionicLoading.hide();
  //   }
  // })
if(onlineStatus.onLine == false){
  $ionicLoading.hide();
  var alertPopup = $ionicPopup.alert({
   template: 'Интернет холболтоо шалгана уу',
   okType :'button-assertive'
 });
}

$http.get('http://www.urilga.mn:1337/event/'+$stateParams.playlistId).success(function(res){
  $scope.list = res;
}).finally(function(){
 $ionicLoading.hide();
})
$scope.agendas = [];
$http.get("http://www.urilga.mn:1337/agenda?agenda_event="+$stateParams.playlistId+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
 if(response.length > 0){
  angular.forEach(response,function(agenda){
   angular.forEach(agenda.agenda_times, function(agenda_time){
    if(agenda_time.time_speaker){
      $http.get('http://www.urilga.mn:1337/speaker/'+agenda_time.time_speaker+'?____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
       agenda_time.time_speaker = response;
       $scope.loader = {loading: true};
     })
    }
    var mydata = {};
    mydata.slot_info = agenda_time.id;
    mydata.voted_by = $localStorage.userdata.user.person.id;
    mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
    SlotVote.get(mydata).success(function (response){
      if (response.length > 0){
        agenda_time.status = response[0].status;
        agenda_time.vote_id = response[0].id;
      }
    })
  })
   $scope.agendas.push(agenda);
   $scope.loader = {loading: true};
 })
  $ionicLoading.hide();
}
else {
  $scope.message = 'Хөтөлбөрийн мэдээлэл ороогүй байна';
  $ionicLoading.hide();
  $scope.loader = {loading: true};
}
})
var person_id = $localStorage.userdata.user.person.id;

// function checkTicket() {
  var event_id = $stateParams.playlistId;
  $http.get('http://www.urilga.mn:1337/ticket?ticket_type=Paid&ticket_type=Free&ticket_user='+person_id+'&ticket_event='+event_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    if(response.length>0){
     $scope.checkTicket = response;
     $scope.check = 1;
   }
 })
// };
// $scope.checkLike = function() {
  var person_id = $localStorage.userdata.user.person.id;
  var event_id = $stateParams.playlistId;
  $http.get("http://www.urilga.mn:1337/eventlike?event_info="+event_id+"&liked_by="+person_id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response) {
    if(response.length > 0) {
      $scope.liker_function = 1;
    }
    else {
     $scope.liker_function = 0;
   }      
 })
// };
// $scope.checkLike();
$scope.$watch('liker_function',function(newVal,oldVal){
  $scope.liker_function = newVal;
}) 
$scope.$watch('checkTicket',function(newVal){
  $scope.checkTicket = newVal;
})
//   if(onlineStatus.onLine ==true){
//    $http.get("http://www.urilga.mn:1337/event/"+$stateParams.playlistId+'?____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response) {
//     $ionicLoading.hide();
//     $scope.list = response;
//     $scope.agendas = [];
//     $http.get("http://www.urilga.mn:1337/agenda?agenda_event="+$scope.list.id+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
//      if(response.length > 0){
//       angular.forEach(response,function(agenda){
//            angular.forEach(agenda.agenda_times, function(agenda_time){
//               if(agenda_time.time_speaker){
//                 $http.get('http://www.urilga.mn:1337/speaker/'+agenda_time.time_speaker+'?____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
//                    agenda_time.time_speaker = response;
//                      $scope.loader = {loading: true};
//                 })
//               }
//               var mydata = {};
//               mydata.slot_info = agenda_time.id;
//               mydata.voted_by = $localStorage.userdata.user.person.id;
//               mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
//               SlotVote.get(mydata).success(function (response){
//                 if (response.length > 0){
//                     agenda_time.status = response[0].status;
//                     agenda_time.vote_id = response[0].id;
//                 }
//               })
//             })
//            $scope.agendas.push(agenda);
//           $scope.loader = {loading: true};
//       })
//       $ionicLoading.hide();
//     }
//     else {
//       $scope.message = 'Хөтөлбөрийн мэдээлэл ороогүй байна';
//       $ionicLoading.hide();
//       $scope.loader = {loading: true};
//     }
//   });
//   }).error(function (data, status, headers, config){
//     if(status == '404'){
//       $ionicLoading.hide();
//       $state.go('app.playlists', {}, {reload:true});
//     }
//   })
// }
// else {
//  $ionicLoading.hide();
//  var alertPopup = $ionicPopup.alert({
//    template: 'Интернет холболтоо шалгана уу',
//    okType :'button-assertive'
//  });
// }
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

  $window.onLoad = checkAll();


  $scope.voteSlot = function(id,status,slot){
    slot.status = status;
    var mydata = {};
    mydata.slot_info = id;
    mydata.status = status;
    mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
    if(slot.vote_id != null){
      mydata.id = slot.vote_id;
      SlotVote.update(mydata).success(function (response){
        console.log('success');
      });
    }else{
      if($localStorage.userdata){
        mydata.voted_by = $localStorage.userdata.user.person;
      }
      SlotVote.save(mydata).success(function(response){
        slot.vote_id = response.id;
      });   
    }
  };


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
    $ionicModal.fromTemplateUrl('templates/suggest.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(smodal) {
      $scope.suggestmodal = smodal;
    });

    $scope.suggest = function() {
      $scope.suggestmodal.show();
    };

    $scope.suggestclose = function() {
      $scope.suggestmodal.hide();
    };
    $scope.suggestPerson = function(data){
      if(!data){
        var alertPopup = $ionicPopup.alert({
          okType: 'button-assertive',
          template: 'Талбарын утгыг бөглөнө үү'
        });
      }
      else {
        if(isNaN(data.info)){
          var invitedata = {};
          invitedata.email = data.info;
          invitedata.event = $stateParams.playlistId;
          invitedata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
          $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in'
          });
          myData.eventInviteByEmail(invitedata).success(function (res){
            if(res){
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                okType: 'button-balanced',
                template: 'Амжилттай илгээлээ'
              })
              alertPopup.then(function(res) {
                $scope.suggestclose();
              });
            }
            else {
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                okType: 'button-assertive',
                template: 'Амжилтгүй'
              });
            }
          })
          .error(function(err){
            $ionicLoading.hide();
          })
        }
        else {
          var invitedata = {};
          invitedata.phonenumber = data.info;
          invitedata.event = $stateParams.playlistId;
          invitedata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
          $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in'
          });
          myData.eventInviteByPhone(invitedata).success(function (res){
            if(res){
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                okType: 'button-balanced',
                template: 'Амжилттай илгээлээ'
              })
              alertPopup.then(function(res) {
                $scope.suggestclose();
              });
            }
            else {
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                okType: 'button-assertive',
                template: 'Амжилтгүй'
              });
            }
          })
          .error(function(err){
            $ionicLoading.hide();
            console.log(err);
          })
        }
      }
    }

    // $scope.imageSrc = 'img/slideimg.jpg';

    $scope.showImage = function(){
      $scope.imageSrc = $scope.list.event_cover;
      $scope.openModal();
    }
    $scope.goBack = function(){
      $ionicHistory.goBack();
    };
    
    $scope.unlikeEvent = function(){
      var person_id = $localStorage.userdata.user.person.id;
      var event_id = $stateParams.playlistId;
      $http.get("http://www.urilga.mn:1337/eventlike?event_info="+event_id+"&liked_by="+person_id+'&____token=dXJpbGdhbW5BY2Nlc3M=',{cache:false}).success(function (response) {
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
      var event_id = $stateParams.playlistId;
      $http.post("http://www.urilga.mn:1337/eventlike",{____token:token,event_info:event_id,liked_by:person_id}).success(function (response){
        console.log('success');
        $scope.liker_function = 1;
      });
    }
    

  })
.controller('guestCtrl',function($scope,$ionicPopup,$rootScope,$window,$state,$ionicSideMenuDelegate){
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.checkUser = function(){
   var confirmPopup = $ionicPopup.confirm({
    template: 'Та нэвтэрч байж ашиглана уу?',
    okText : 'Нэвтрэх',
    okType: 'button-balanced',
    cssClass: 'guestBtn',
    cancelText : 'Болих'
  });
   confirmPopup.then(function(res) {
     if(res) {
      $state.go('main');
    } else {
     console.log('You are not sure');
   }
 });
 }
 $rootScope.backsite = "http://www.urilga.mn:1337";
})
.controller('guestsearchCtrl',function($scope,$localStorage,$ionicHistory,$http,$ionicPopup,$rootScope,$window,$state,$ionicSideMenuDelegate){
 $scope.myGoBack = function() {
  $ionicHistory.goBack();
}
$scope.counter = 0;

$scope.searchTitle = function(data){
 if(data == ""){
  data = undefined;
}
$http.get('http://www.urilga.mn:1337/eventsearch?query='+data+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
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
.controller('guestcategoryCtrl',function($scope,ImgCache,$localStorage,$ionicPopover,$ionicLoading,$stateParams,$timeout,$http,$ionicPopup,onlineStatus,$rootScope,$window,$state,$ionicSideMenuDelegate){
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
$scope.sortReverse  =  true;

$scope.sortName = [
{ text:"A-Z",name: "downName", icon: 'fa-sort-alpha-asc'},
{ text:"Z-A",name: "upName", icon: 'fa-sort-alpha-desc'}
];
$scope.sortType = [
{ text:"Бүх арга хэмжээ", eventType: "all"},
{ text:"Үнэгүй", eventType: "free"},
{ text:"Төлбөртэй", eventType: "paid"}
];
$scope.sortDate = [
{text:"Орсон өдөр", dateType: "createDate"},
{text:"Эхлэх хугацаа", dateType: "orderDate"}
];
$scope.sortByDate = function(data){
  delete data.eventType;
  delete data.name;
  if(data.dateType == 'createDate'){
    $scope.sortType = 'createdAt';
    $scope.sortReverse = true;
  }
  else if (data.dateType== 'orderDate'){
    $scope.sortType = 'event_start_date';
    $scope.sortReverse = true;
  }
  $scope.hidePop();
}
$scope.sortByType = function(data){
  delete data.name;
  if(data.eventType == 'free'){
    $scope.events = $localStorage.eventType.free;
  }
  else if(data.eventType == 'paid'){
    $scope.events = $localStorage.eventType.paid;
  }
  else if(data.eventType == 'all'){
    var all = [];
    all =  $localStorage.eventType.free.concat($localStorage.eventType.paid);
    $scope.events = all;
  }
  $scope.hidePop();
}
$scope.sortByName = function(data){
  delete data.eventType;
  if(data.name == 'downName'){
    $scope.sortType = 'event_title';
    $scope.sortReverse = false;
  }
  else if (data.name == 'upName'){
    $scope.sortType = 'event_title';
    $scope.sortReverse = true;
  }
  $scope.hidePop();
}
$scope.eventid = $stateParams.categoryId;
$scope.onlineStatus = onlineStatus;
$scope.doRefresh = function(){
  if($scope.onlineStatus.onLine == true){
    $timeout(function(){
      $http.get('http://www.urilga.mn:1337/category?____token=dXJpbGdhbW5BY2Nlc3M=').success(function(res){
        $localStorage.categoryEvent = res;
      })
      ImgCache.$init();
      $scope.$broadcast('scroll.refreshComplete');
    },1000);
  }
}
$scope.onLoad = function(){
  if($localStorage.categoryEvent){
    angular.forEach($localStorage.categoryEvent,function(category){
      if(category.id == $stateParams.categoryId){
        $scope.items = category;
        var result = category.events;
        $scope.events = [];
        var eventType = {};
        eventType.free = [];
        eventType.paid = [];
        angular.forEach(result,function(event){
          if(event.event_isActive == true){
            $scope.events.push(event);
          }
          if(event.event_ticket_type == 'Paid'){
            eventType.paid.push(event);
          }
          else if (event.event_ticket_type == 'Free'){
            eventType.free.push(event)
          }
          $localStorage.eventType = eventType;
        })
        $ionicLoading.hide();
      }
    })  
  }
  else {
    $scope.doRefresh();
    $ionicLoading.hide();
  }
}
$window.onload = $scope.onLoad();
$scope.limit = 5;
$scope.loadMore = function() {
 if($scope.events.length > 5){
  $scope.limit += 5;
  ImgCache.$init();
  $scope.$broadcast('scroll.infiniteScrollComplete');
}
}
$scope.goBack = function(){
  $state.go('guest.home');
};

})
.controller('guestDetailCtrl',function($scope,SlotVote,myData,$ionicModal,$localStorage,$ionicPopup,$cordovaSocialSharing,$interval,$ionicHistory,$http,$stateParams,$ionicLoading,onlineStatus,$rootScope,$window,$state,$ionicSideMenuDelegate){
  $scope.goBack = function(){
    $ionicHistory.goBack();
  };
  if(onlineStatus.onLine == false){
    $ionicLoading.hide();
    var alertPopup = $ionicPopup.alert({
     template: 'Интернет холболтоо шалгана уу',
     okType :'button-assertive'
   });
  }
  $scope.checkLike = function(){
   var confirmPopup = $ionicPopup.confirm({
    template: 'Арга хэмжэээ хадгалахын тулд нэвтэрнэ үү?',
    okText : 'Нэвтрэх',
    cssClass: 'guestBtn',
    okType: 'button-balanced',
    cancelText : 'Болих'
  });
   confirmPopup.then(function(res) {
     if(res) {
      $state.go('main');
    } else {
     console.log('You are not sure');
   }
 });
 }
 $scope.checkUser = function(){
  var confirmPopup = $ionicPopup.confirm({
   template: 'Тасалбар худалдаж авахын тулд нэвтэрнэ үү?',
   okText : 'Нэвтрэх',
   cssClass: 'guestBtn',
   okType: 'button-balanced',
   cancelText : 'Болих'
 });
  confirmPopup.then(function(res) {
   if(res) {
    $state.go('main');
  } else {
   console.log('You are not sure');
 }
});
}
function checkAll() {
  $http.get("http://www.urilga.mn:1337/eventlike?event_info="+$stateParams.eventId+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.eventlike = response;
  })
  $http.get("http://www.urilga.mn:1337/ticket?ticket_event="+$stateParams.eventId+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.going = response;
  })
  $http.get("http://www.urilga.mn:1337/eventjoiner?ticket_info="+$stateParams.eventId+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.maybe = response;
  })
  $http.get("http://www.urilga.mn:1337/eventsub?event_info="+$stateParams.eventId+
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
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
  }); 
  // var events = $localStorage.events.all;
  // angular.forEach(events , function(event){
  //   if(event.id == $stateParams.eventId){
  //     $scope.list = event;
  //     $ionicLoading.hide();
  //   }
  // })
$http.get('http://www.urilga.mn:1337/event/'+$stateParams.eventId).success(function(res){
  $scope.list = res;
}).finally(function(){
 $ionicLoading.hide();
})
$scope.agendas = [];
$http.get("http://www.urilga.mn:1337/agenda?agenda_event="+$stateParams.eventId+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
 if(response.length > 0){
  angular.forEach(response,function(agenda){
   angular.forEach(agenda.agenda_times, function(agenda_time){
    if(agenda_time.time_speaker){
      $http.get('http://www.urilga.mn:1337/speaker/'+agenda_time.time_speaker+'?____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
       agenda_time.time_speaker = response;
       $scope.loader = {loading: true};
     })
    }
  })
   $scope.agendas.push(agenda);
   $scope.loader = {loading: true};
 })

  $ionicLoading.hide();
}
else {
  $scope.message = 'Хөтөлбөрийн мэдээлэл ороогүй байна';
  $ionicLoading.hide();
  $scope.loader = {loading: true};
}
})

$ionicModal.fromTemplateUrl('templates/suggest.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function(smodal) {
  $scope.suggestmodal = smodal;
});

$scope.suggest = function() {
  $scope.suggestmodal.show();
};

$scope.suggestclose = function() {
  $scope.suggestmodal.hide();
};
$scope.suggestPerson = function(data){
  if(!data){
    var alertPopup = $ionicPopup.alert({
      okType: 'button-assertive',
      template: 'Талбарын утгыг бөглөнө үү'
    });
  }
  else {
    if(isNaN(data.info)){
      var invitedata = {};
      invitedata.email = data.info;
      invitedata.event = $stateParams.playlistId;
      invitedata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in'
      });
      myData.eventInviteByEmail(invitedata).success(function (res){
        if(res){
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            okType: 'button-balanced',
            template: 'Амжилттай илгээлээ'
          })
          alertPopup.then(function(res) {
            $scope.suggestclose();
          });
        }
        else {
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            okType: 'button-assertive',
            template: 'Амжилтгүй'
          });
        }
      })
      .error(function(err){
        $ionicLoading.hide();
      })
    }
    else {
      var invitedata = {};
      invitedata.phonenumber = data.info;
      invitedata.event = $stateParams.playlistId;
      invitedata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in'
      });
      myData.eventInviteByPhone(invitedata).success(function (res){
        if(res){
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            okType: 'button-balanced',
            template: 'Амжилттай илгээлээ'
          })
          alertPopup.then(function(res) {
            $scope.suggestclose();
          });
        }
        else {
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            okType: 'button-assertive',
            template: 'Амжилтгүй'
          });
        }
      })
      .error(function(err){
        $ionicLoading.hide();
        console.log(err);
      })
    }
  }
}

$scope.voteSlot = function(id,status,slot){
  slot.status = status;
  var mydata = {};
  mydata.slot_info = id;
  mydata.status = status;
  mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
  if(slot.vote_id != null){
    mydata.id = slot.vote_id;
    SlotVote.update(mydata).success(function (response){
      console.log('success');
    });
  }else{
    if($localStorage.userdata){
      mydata.voted_by = $localStorage.userdata.user.person;
    }
    SlotVote.save(mydata).success(function(response){
      slot.vote_id = response.id;
    });   
  }
};
$scope.shareAnywhere = function() {
  $cordovaSocialSharing.share($scope.list.event_title, null, null, 'http://www.urilga.mn/#/event_details/'+$scope.list.id);
};

})
.controller('guestHomeCtrl',function($scope,$ionicModal,myData,$ionicPopup,ImgCache,$ionicSideMenuDelegate,$window,onlineStatus,$ionicLoading,$state,$localStorage,$http,$timeout){


$http.get("http://www.urilga.mn:1337/category?____token=dXJpbGdhbW5BY2Nlc3M=").success(function (res){
  $localStorage.categoryEvent = res;
})
$scope.doRefresh = function() {
 $ionicLoading.show({
  content: 'Loading',
  animation: 'fade-in'
});
 if (onlineStatus.onLine == true) {
  $http.get('http://www.urilga.mn:1337/todayevents?____token=dXJpbGdhbW5BY2Nlc3M=').success(function(response){
    $scope.today_event = response;
    $ionicLoading.hide();
  })
  $http.get('http://www.urilga.mn:1337/tomorrowevents?____token=dXJpbGdhbW5BY2Nlc3M=').success(function(response){
    $scope.tomorrow_event = response;
    $ionicLoading.hide();
  })
  $http.get('http://www.urilga.mn:1337/findevent?____token=dXJpbGdhbW5BY2Nlc3M=').success(function(response){
    $scope.lists = response;
    $ionicLoading.hide();
  })
  .finally(function(){
   ImgCache.$init();
   $scope.$broadcast('scroll.refreshComplete');
 })
}
else if(onlineStatus.onLine == false){
  var alertPopup = $ionicPopup.alert({
   okType :'button-assertive',
   template: 'Интернет холболтоо шалгана уу'
 });
  alertPopup.then(function(res) {
   $scope.$broadcast('scroll.refreshComplete');
 });
}
}
$window.onload = $scope.doRefresh();

$scope.slideChanged = function(index) {
  $scope.slideIndex = index;
}
$scope.scrollTop = function() {
  $ionicScrollDelegate.scrollTop();
};
$scope.index = 0;
$scope.buttonClicked = function(index){
  $scope.index = index;
  if($scope.index == 0){
   $http.get('http://www.urilga.mn:1337/todayevents?____token=dXJpbGdhbW5BY2Nlc3M=').success(function(response){
    $ionicLoading.hide();
    $scope.today_event = response;
  })
 }
 else if ($scope.index == 1){
  $http.get('http://www.urilga.mn:1337/tomorrowevents?____token=dXJpbGdhbW5BY2Nlc3M=').success(function(response){
    $ionicLoading.hide();
    $scope.tomorrow_event = response;
  })
}
else {
 $http.get('http://www.urilga.mn:1337/findevent?____token=dXJpbGdhbW5BY2Nlc3M=').success(function(response){
  $ionicLoading.hide();
  $scope.lists = response;
})
}
$scope.$apply();
}
$scope.toggleLeftSideMenu = function() {
  $ionicSideMenuDelegate.toggleLeft();
};

var i=1; 
$scope.loadMore = function() {
  i=i+1;
  $http.get('http://www.urilga.mn:1337/findevent?page_number='+i+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function(res){
    angular.forEach(res,function(item){
      $scope.lists.push(item);
    })
    $ionicLoading.hide();
    $scope.$broadcast('scroll.infiniteScrollComplete');
  })
}
$ionicModal.fromTemplateUrl('templates/suggest.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function(smodal) {
  $scope.suggestmodal = smodal;
});

$scope.suggest = function(data) {
  $scope.list = data;
  $scope.suggestmodal.show();
};
$scope.suggestclose = function() {
  $scope.suggestmodal.hide();
};
$scope.suggestPerson = function(data){
 if(!data){
  var alertPopup = $ionicPopup.alert({
    okType: 'button-assertive',
    template: 'Талбарын утгыг бөглөнө үү'
  });
}
else {
  if(isNaN(data.info)){
    var invitedata = {};
    invitedata.email = data.info;
    invitedata.event = $scope.list.id;
    invitedata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in'
    });
    myData.eventInviteByEmail(invitedata).success(function (res){
      if(res){
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          okType: 'button-balanced',
          template: 'Амжилттай илгээлээ'
        })
        alertPopup.then(function(res) {
          $scope.suggestclose();
        });
      }
      else {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          okType: 'button-assertive',
          template: 'Амжилтгүй'
        });
      }
    })
    .error(function(err){
      $ionicLoading.hide();
    })
  }
  else {
    var invitedata = {};
    invitedata.phonenumber = data.info;
    invitedata.event = $scope.list.id;
    invitedata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in'
    });
    myData.eventInviteByPhone(invitedata).success(function (res){
      if(res){
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          okType: 'button-balanced',
          template: 'Амжилттай илгээлээ'
        })
        alertPopup.then(function(res) {
          $scope.suggestclose();
        });
      }
      else {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          okType: 'button-assertive',
          template: 'Амжилтгүй'
        });
      }
    })
    .error(function(err){
      $ionicLoading.hide();
      console.log(err);
    })
  }
}
}
  $scope.checkLike = function(){
   var confirmPopup = $ionicPopup.confirm({
    template: 'Арга хэмжэээ хадгалахын тулд нэвтэрнэ үү?',
    okText : 'Нэвтрэх',
    cssClass: 'guestBtn',
    okType: 'button-balanced',
    cancelText : 'Буцах'
  });
   confirmPopup.then(function(res) {
     if(res) {
      $state.go('main');
    } else {
     console.log('You are not sure');
   }
 });
 }
})
.controller('addEventCtrl',function($state,$scope,onlineStatus,$localStorage,$ionicLoading,$http,$ionicPopup){
  $scope.goBack = function(){
    $state.go('app.playlists');
  }
  $scope.checked = false;
  $scope.check =function(data){
    console.log(data);
  }
  var person = $localStorage.userdata.user.person.id;
  $http.get('http://www.urilga.mn:1337/org?organization_created_by='+person+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function(res){
    $scope.myorgs = res;
    if($scope.myorgs.length == 1){
      $scope.event.owner = res[0];
    }
  })
  $scope.event = {};
  $scope.event.event_start_date = new Date();
  $scope.event.event_end_date = new Date();
  $scope.event.event_start_time = new Date();
  $scope.event.event_title = 'Meeting';
  $scope.event.event_location = 'Ulaanbaatar';
  $scope.createEvent = function(data){
  if(onlineStatus.status == true){
   $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
    var mydata = {};
    mydata = data;
    mydata.event_isActive = false;
    mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
    mydata.event_created_by = person;
    mydata.event_all_ticket_remaining = 100;
    mydata.event_urilga_ticket_remaining = 100;
    if(data.owner){
      mydata.event_owner = [];
      mydata.event_owner.push(data.owner);
    }
    $http.post('http://www.urilga.mn:1337/event',mydata).success(function(res){
      if(res){
        var ticketdata = {};
        ticketdata.type = 'Urilga';
        ticketdata.urilga_type ='basic';
        ticketdata.all_count = 100;
        ticketdata.remaining = 100;
        ticketdata.description = 'Urilga Ticket';
        ticketdata.event_info = res.id;
        ticketdata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
        $http.post('http://www.urilga.mn:1337/tickettype',ticketdata).success(function(response){
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            okType: 'button-balanced',
            template: 'Амжилттай үүслээ'
          });
          alertPopup.then(function(res) {
            $state.go('app.myevent',{},{reload:true});
         });
        })
      }
      else {
        $ionicLoading.hide();
      }
    })
  }
  else {
    $ionicLoading.hide();
    var alertPopup = $ionicPopup.alert({
     okType :'button-assertive',
     template: 'Интернет холболтоо шалгана уу'
   });
    alertPopup.then(function(res) {
     $scope.$broadcast('scroll.refreshComplete');
   });
  }
  }

})
.controller('editEventCtrl',function($state,$window,$scope,onlineStatus,$ionicPopup,$ionicModal,$ionicLoading,$localStorage,$ionicHistory,$stateParams,$http){
  $scope.goBack = function(){
    $ionicHistory.goBack();
  }
  $scope.is_Joined = 0;
  $scope.doRefresh = function(){
    $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in'
    });
    $http.get('http://www.urilga.mn:1337/ticket?ticket_event='+$stateParams.eventId+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function(res){
      $scope.users = res;
      $ionicLoading.hide();
    })
    $http.get('http://www.urilga.mn:1337/event/'+$stateParams.eventId).success(function(res){
      $scope.event = res;
      $scope.event.event_start_date = new Date($scope.event.event_start_date);
      $scope.event.event_end_date = new Date($scope.event.event_end_date);
      $scope.event.event_start_time = new Date($scope.event.event_start_time);
      $scope.myOrgs = $scope.event.event_owner;
      $ionicLoading.hide();
      if($scope.myOrgs.length > 0){
        angular.forEach($scope.myOrgs,function(org){
         $http.get('http://www.urilga.mn:1337/person?person_org_code='+org.organization_code+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function(response){
          $scope.workers = response;
          $ionicLoading.hide();
          angular.forEach($scope.workers,function(worker){
             var person_email = worker.id;
             $http.get('http://www.urilga.mn:1337/ticket?ticket_event='+$stateParams.eventId+'&ticket_user='+person_email+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function(response){
              if(response.length > 0){
                if(response[0].ticket_isActive == true){
                    $scope.is_Joined = 1;
                }
                else {
                  $scope.is_Joined = 2;
                }
              }
             })
          })
        })
       })
        $scope.event_ticket = {};
        $scope.event_ticket.free = [];
        $scope.event_ticket.paid = [];
        $scope.event_ticket.urilga = [];
        $scope.myevent = false;
        if($scope.event.event_created_by.id == $localStorage.userdata.user.person.id){
         $scope.myevent = true;
       }
       angular.forEach(res.event_ticket_types,function(item){
        if(item.type == "Paid"){
          $scope.event_ticket.paid.push(item);
        }
        if(item.type == "Free"){
          $scope.event_ticket.free.push(item);
        }
        if(item.type == "Urilga"){
          $scope.event_ticket.urilga.push(item);
        }
      })
     }
   })
  }
  $window.onload = $scope.doRefresh();
  if(onlineStatus.onLine == false){
  $ionicLoading.hide();
  var alertPopup = $ionicPopup.alert({
   okType :'button-assertive',
   template: 'Интернет холболтоо шалгана уу'
 });
  alertPopup.then(function(res) {
   $scope.$broadcast('scroll.refreshComplete');
 });
}
  $ionicModal.fromTemplateUrl('templates/sendUrilga.html', {
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
  $ionicModal.fromTemplateUrl('templates/editEventPopup.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.editmodal = modal;
  });
  $scope.editOpenModal = function() {
    $scope.editmodal.show();
  };
  $scope.editCloseModal = function() {
    $scope.editmodal.hide();
  };
  $scope.addWorker = function(data){
    $scope.openModal();
    $scope.ticket = {};
    $scope.ticket.ticket_fullname = data.person_firstname +" "+data.person_lastname;
    $scope.ticket.ticket_email = data.person_email;
    $scope.ticket.ticket_phonenumber = data.person_cell_number;
  }
  $scope.buyTicket = function(data){
   $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in'
    });
    var mydata = {};
    mydata = data;
    mydata.ticket_countof = 1;
    var etype = JSON.parse(data.event_ticket_type);
    mydata.ticket_type = etype.type;
    mydata.ticket_type_model = etype.id;
    mydata.ticket_description = etype.description;
    mydata.ticket_price = etype.price;
    mydata.ticket_urilga_type = 'basic';
    mydata.ticket_created_by = $localStorage.userdata.user.person.id;
    mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
    $http.get('http://www.urilga.mn:1337/person?person_email='+data.ticket_email+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
      person_info = response[0];
      if(person_info) {
        mydata.ticket_event = $stateParams.eventId;
        mydata.ticket_user_email = person_info.person_email;
        mydata.ticket_user_name = person_info.person_lastname;
      }
      else {
        mydata.ticket_event = $stateParams.eventId;
        mydata.ticket_user_email = $localStorage.userdata.user.person.person_email;
        mydata.ticket_user_name  = $localStorage.userdata.user.person.person_lastname;
      }
      $http.post('http://www.urilga.mn:1337/ticket',mydata).success(function (response){
       if(response.state){
        $ionicLoading.hide();
        var popup = $ionicPopup.alert({
          template:'Тасалбар авах боломжгүй',
          okType :'button-assertive'
        })
      }
      else{
        $ionicLoading.hide();
        var popup = $ionicPopup.alert({
          template:'Худалдан авалт амжилттай боллоо.',
          okType :'button-balanced'
        })
        popup.then(function(){
          $scope.doRefresh();
          $scope.closeModal();
        })
    }
  })
  })
  }
  $scope.eventId = $stateParams.eventId;
  $scope.index = 0;
$scope.buttonClicked = function(data){
  $scope.index = data;
}
$scope.editEvent = function(data){
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in'
  });
  var mydata = {};
  mydata = data;
  mydata.____token = 'dXJpbGdhbW5BY2Nlc3M=';
  console.log(mydata);
  $http.put('http://www.urilga.mn:1337/event/'+mydata.id,mydata).success(function(response){
    console.log(response);
    if(response.status == true){
      $ionicLoading.hide();
      var popup = $ionicPopup.alert({
        template:'Амжилттай өөрчлөгдлөө.',
        okType :'button-balanced'
      })
      popup.then(function(){
        $scope.editCloseModal();
      })
    }
    else {
      $ionicLoading.hide();
    }
  })
}
})
.controller('urilgaImgCtrl',function($scope,$window,$state,$ionicModal,$ionicHistory,$ionicPopup,$http,$stateParams,$ionicSlideBoxDelegate){
  $scope.goBack = function(){
    $ionicHistory.goBack();
  }
  $scope.size = 200;
  $scope.doRefresh = function(){
     $http.get('http://www.urilga.mn:1337/ticket?ticket_transaction_id='+$stateParams.urilgaId+'&____token=dXJpbGdhbW5BY2Nlc3M=').success(function (response){
    $scope.tickets = response;
    $ionicSlideBoxDelegate.update();
  })
  }
  $window.onload = $scope.doRefresh();
   $scope.acceptTicket = function(data){
    var mydata = {};
    mydata.id = data.id;
    mydata.ticket_isActive = true;
    mydata.ticket_rejected = false;
    mydata.____token ='dXJpbGdhbW5BY2Nlc3M=';
    $http.put('http://www.urilga.mn:1337/ticket/'+mydata.id,mydata).success(function (response){
      $scope.doRefresh();
    })
    console.log('accepted');
  }
  $scope.unacceptTicket = function(data){
    var mydata = {};
    mydata.id = data.id;
    mydata.ticket_isActive = false;
    mydata.____token ='dXJpbGdhbW5BY2Nlc3M=';
    $http.put('http://www.urilga.mn:1337/ticket/'+mydata.id,mydata).success(function (response){
      $scope.doRefresh();
    })
    console.log('unaccepted');
  }
  $scope.deleteTicket = function(data){
    var mydata = {};
    mydata.id = data.id;
    mydata.token ='dXJpbGdhbW5BY2Nlc3M=';
    $http.delete('http://www.urilga.mn:1337/ticket/'+mydata.id+'?____token='+mydata.token).success(function (response){
      console.log('deleted');
      $state.go('app.invitation');
      $scope.doRefresh();
    })
  }
  $scope.rejectedTicket = function(data){
    var mydata = {};
    mydata.id = data.id;
    mydata.ticket_rejected = true;
    mydata.ticket_isActive = false;
    mydata.____token ='dXJpbGdhbW5BY2Nlc3M=';
    $http.put('http://www.urilga.mn:1337/ticket/'+mydata.id,mydata).success(function (response){
      $scope.doRefresh();
    })
    console.log('rejected');
  }
  $scope.unrejectedTicket = function(data){
    var mydata = {};
    mydata.id = data.id;
    mydata.ticket_rejected = false;
    mydata.____token ='dXJpbGdhbW5BY2Nlc3M=';
    $http.put('http://www.urilga.mn:1337/ticket/'+mydata.id,mydata).success(function (response){
      $scope.doRefresh();
    })
    console.log('unrejected');
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
;


