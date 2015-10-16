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
}]);

myapp.controller('AppCtrl', function($scope,$facebook,$ionicSideMenuDelegate,$state, $timeout,$ionicLoading,$localStorage,$ionicHistory,$http,$window) {
  

      var user_id = $localStorage.userdata.user.person.id;
      $scope.user_info = $localStorage.userdata.user.person;
      function checkAll() {
      $http.get('http://52.69.108.195:1337/ticket?ticket_type=Urilga&ticket_user='+user_id).success(function (response){
        $scope.urilga = response;
      });
$http.get('http://52.69.108.195:1337/ticket?ticket_type=Paid&ticket_type=Free&ticket_user='+user_id).success(function (response){
        $scope.tickets = response;
      });

      $http.get("http://52.69.108.195:1337/eventlike?liked_by="+user_id).success(function (response){
            $scope.likedEvent = response;
      })
       $http.get("http://52.69.108.195:1337/eventjoin?joined_by="+user_id).success(function (response){
            $scope.joinedEvent = response;
      })
   }
   $scope.backSite = 'http://52.69.108.195:1337';
   $scope.left = function(){
     $ionicSideMenuDelegate.toggleLeft();
   }
 
   setInterval(function(){
    checkAll();
  },1000);

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  }

  $scope.userdata = $localStorage.userdata;



  $scope.logout = function(){
       $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
      });
    $timeout(function (res){
            $window.location.reload();
            localStorage.clear();
            $ionicLoading.hide();
              $state.go('homeLogin',{},{reload:true});
              console.log('garlaa');

      },1000);
  };
})



.controller('PlaylistsCtrl', function($window,$ionicSideMenuDelegate,$scope,onlineStatus,$rootScope,$ionicPopup,$cordovaNetwork,$timeout,$http,$ionicLoading,$localStorage,$ionicScrollDelegate) {
   $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
$scope.backSite = 'http://52.69.108.195:1337';
 $scope.onlineStatus = onlineStatus;
$scope.numberOfItemsToDisplay = 10;
    $scope.loadMore = function() {
      if($scope.lists.length > $scope.numberOfItemsToDisplay){
        $scope.numberOfItemsToDisplay +=10;
      }
       $scope.$broadcast('scroll.infiniteScrollComplete');
  };
 $scope.toggleLeftSideMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

$scope.clearSearch = function(search){
 search.utga = null;
 console.log(search);
}

 $scope.doRefresh = function() {
  if ($scope.onlineStatus.onLine == true) {
           $timeout (function(){
      $http.get("http://52.69.108.195:1337/event").success(function (response) {
      $scope.lists = response;
      var today = new Date();
      var todayDate = today.toDateString();
      var tomorrow = today.setDate(today.getDate()+1);
      var tomorrow_date = new Date(tomorrow).toDateString();
      $scope.today_event = [];
      $scope.tomorrow_event = [];
      $scope.upcoming_event = [];
      for( i in $scope.lists){
           var event_date = new Date($scope.lists[i].event_start_date);
           $scope.event_date = event_date.toDateString();
           var event_mill = event_date.valueOf();
           if(todayDate == $scope.event_date){
              $scope.today_event.push($scope.lists[i]);
              $scope.isHave = 1;
           }
           else if (tomorrow_date == $scope.event_date) {
            $scope.tomorrow_event.push($scope.lists[i]);
             $scope.isHave = 1;
           }
           else if (tomorrow < event_mill) {
            $scope.upcoming_event.push($scope.lists[i])
             $scope.isHave = 1;
           }
           else {
            $scope.message = 'Хараахан мэдээлэл ороогүй байна.';
           }
      }
   
   
    })
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

  
  window.onload = $scope.doRefresh();

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

  $http.get("http://52.69.108.195:1337/event").success(function (response) {
  if(response.length>=0) {
    $scope.lists = response;
        $ionicLoading.hide();
  }


  })

  $scope.baseURL = "http://52.69.108.195:1337/";
  $http.get('http://52.69.108.195:1337/category').success(function (response){
      $scope.categories = response;
    })


})

.controller('ProfileCtrl',function($scope,$ionicLoading,onlineStatus,$ionicPopup,$http,$localStorage,$window,$state,$timeout){
    $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
   
      var user_id =  $localStorage.userdata.user.person.id;
      $http.get('http://52.69.108.195:1337/person/'+user_id).success(function (response){
        $ionicLoading.hide();
        $scope.user =response;
      })
      $scope.onlineStatus = onlineStatus
      $scope.Update =function(user){
        if($scope.onlineStatus.onLine == true){
        $scope.mydata = user;
         $scope.mydata.person_email;
        $http.put('http://52.69.108.195:1337/person/'+user_id,{person_email:$scope.mydata.person_email,person_firstname:$scope.mydata.person_firstname,person_lastname:$scope.mydata.person_lastname,person_cell_number:$scope.mydata.person_cell_number}).success( function (response){
              $localStorage.userdata.user.person = response.updated_person;
               var alertPopup = $ionicPopup.alert({
                 template: 'Амжилттай',
                   okType :'button-assertive'
               });
        })
      }
      else {
           var alertPopup = $ionicPopup.alert({
                   okType :'button-assertive',
                 template: 'Интернет холболтоо шалгана уу'
               });
      }
      };
      console.log($localStorage.userdata.user.person.person_firstname);
   $scope.checkLength = function(data) {
          if($scope.user.person_lastname.length>$localStorage.userdata.user.person.person_lastname.length | $scope.user.person_lastname.length<$localStorage.userdata.user.person.person_lastname.length | $scope.user.person_firstname.length>$localStorage.userdata.user.person.person_firstname.length |  $scope.user.person_firstname.length<$localStorage.userdata.user.person.person_firstname.length |  $scope.user.person_cell_number.length>$localStorage.userdata.user.person.person_cell_number.length |  $scope.user.person_cell_number.length<$localStorage.userdata.user.person.person_cell_number.length){
         return false;
       }
        else {
          return true;
        }
      };

      $scope.goBack = function(){
      $window.history.back();

  };
})

.controller('buyTicketCtrl',function($scope,$cordovaToast,onlineStatus,$localStorage,$stateParams,$http,$window,$state,$timeout,$ionicLoading,$ionicPopup){
 
  $http.get('http://52.69.108.195:1337/event/'+$stateParams.playlistId).success(function (response){
    $scope.event_info = response;
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
  $scope.isChecked = {checked: false};
  $scope.onlineStatus =onlineStatus;
  $scope.buyTicket = function(ticket){
      if($scope.onlineStatus.onLine == true){
     $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
      $scope.mydata = ticket;
     if($scope.ticket_counter > 1){
              $scope.mydata.ticket_phonenumber = "";
              $scope.mydata.ticket_email = "";
              $scope.mydata.ticket_fullname = "";
      }
    var etype = JSON.parse(ticket.event_ticket_type);
    $scope.mydata.ticket_type = etype.type;
    $scope.mydata.ticket_description = etype.description;
    $scope.mydata.ticket_price = etype.price;
    $scope.mydata.ticket_countof = $scope.ticket_counter;
    $scope.mydata.ticket_created_by = user_id;
     $http.get('http://52.69.108.195:1337/person?person_email='+ticket.ticket_email).success(function (response){
        person_info = response[0];
        if(person_info) {
        $scope.mydata.ticket_user = person_info.id;
        $scope.mydata.ticket_event = $stateParams.playlistId;
        $scope.mydata.ticket_user_email = person_info.person_email;
        $scope.mydata.ticket_user_name = person_info.person_lastname;
        }
        else {
           $scope.mydata.ticket_user = user_id; 
            $scope.mydata.ticket_event = $stateParams.playlistId;
            $scope.mydata.ticket_user_email = $localStorage.userdata.user.person.person_email;
            $scope.mydata.ticket_user_name  = $localStorage.userdata.user.person.person_lastname;
        }
     $http.post('http://52.69.108.195:1337/ticket',$scope.mydata).success(function (response){
        $ionicLoading.hide();
        var popup = $ionicPopup.alert({
          template:'Амжилттай',
          okType :'button-assertive'
        })
        popup.then(function() {
           $state.go('app.buyticketImg',{eventId:response.id});
        });
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


.controller('myEventCtrl',function($scope,$localStorage,$ionicPopup,onlineStatus,$ionicLoading,$http,$window,$state,$timeout){
     $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
$scope.onlineStatus = onlineStatus;
$scope.doRefresh = function(){
  if($scope.onlineStatus.onLine == true){
  $timeout(function(){
       $http.get('http://52.69.108.195:1337/event?event_created_by='+user_id).success(function (response){
      $scope.myEvents = response;
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
}

window.onload = $scope.doRefresh();

 var user_id = $localStorage.userdata.user.person.id;
  $http.get('http://52.69.108.195:1337/event?event_created_by='+user_id).success(function (response){
    if(response.length>0){
    $scope.myEvents = response;
    $scope.doRefresh();
   }
   else {
    $scope.message = "Хараахан мэдээлэл ороогүй байна";
   }
   $ionicLoading.hide();
  })

      $scope.goBack = function(){
      $window.history.back();
  };
})

.controller('myOrgCtrl',function($scope,$localStorage,$ionicPopup,onlineStatus,$ionicLoading,$http,$window,$state,$timeout){
     $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
$scope.onlineStatus = onlineStatus;
$scope.doRefresh = function(){
  if($scope.onlineStatus.onLine == true){
  $timeout(function(){
       $http.get('http://52.69.108.195:1337/org?organization_created_by='+user_id).success(function (response){
      $scope.myOrgs = response;
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

window.onload = $scope.doRefresh();

 var user_id = $localStorage.userdata.user.person.id;


      $scope.goBack = function(){
      $window.history.back();
  };
})

.controller('OrgCtrl',function($scope,$localStorage,onlineStatus,$ionicPopup,$ionicLoading,$http,$window,$state,$timeout,$stateParams){
     $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  $http.get('http://52.69.108.195:1337/org/'+$stateParams.myOrgId).success(function (response){
    $scope.org = response;
   $ionicLoading.hide();
  });

  $scope.Update = function(data){
     if(onlineStatus.onLine == true){
    $http.put('http://52.69.108.195:1337/org/'+$stateParams.myOrgId,{organization_fullname:data.organization_fullname,organization_register_id:data.organization_register_id,organization_email:data.organization_email,organization_website:data.organization_website,organization_work_number:data.organization_work_number}).success( function (response){
      
           $ionicPopup.alert({
                 template: 'Амжилттай',
                   okType :'button-assertive'
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

.controller('CategoryItemCtrl', function($scope,$ionicLoading,onlineStatus,$ionicPopup,$timeout,$http,$stateParams,$window) {     
 $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

 $scope.onlineStatus = onlineStatus;
 $scope.doRefresh = function() {
  if($scope.onlineStatus.onLine == true) {
      $timeout (function(){
    $http.get('http://52.69.108.195:1337/category/'+$stateParams.category_Id).success(function (response){
    $scope.items = response;
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
setInterval(function(){
  $scope.doRefresh();
},1000);
  $scope.backSite = 'http://52.69.108.195:1337';
   window.onload = $scope.doRefresh();
      $scope.goBack = function(){
      $window.history.back();
  }
  if(onlineStatus.onLine == true){
  $http.get('http://52.69.108.195:1337/category/'+$stateParams.category_Id).success(function (response){
   if(response.events.length > 0){
    $scope.items = response;
    $scope.isItem = true;
    $scope.doRefresh();
  }
  else {
    $scope.isItem = false;
    $scope.message = "Хараахан мэдээлэл ороогүй байна";
  }
      $ionicLoading.hide();
  });
}
else {
      $ionicLoading.hide();
     var alertPopup = $ionicPopup.alert({
                   okType :'button-assertive',
                 template: 'Интернет холболтоо шалгана уу'
               });
                 
          
}
})

.controller('InvitationCtrl', function($scope,$ionicLoading,$ionicPopup,onlineStatus,$timeout,$http,$stateParams,$localStorage,$ionicModal,$ionicSlideBoxDelegate,$window) {

$ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  }); 

$timeout(function(){
     $ionicSlideBoxDelegate.update();
 },1000);
  
  $scope.acceptTicket = function(data){
  var mydata = {};
  mydata.id = data.id;
  mydata.ticket_isActive = true;
  $http.put('http://52.69.108.195:1337/ticket/'+mydata.id,mydata).success(function (response){
    $scope.doRefresh();
  })
  console.log('accepted');
}
$scope.deleteTicket = function(data){
  var mydata = {};
  mydata.id = data.id;
   $http.delete('http://52.69.108.195:1337/ticket/'+mydata.id).success(function (response){
    console.log('rejected');
    $scope.doRefresh();
   })
  
}
$scope.backSite = 'http://52.69.108.195:1337';
      $scope.goBack = function(){
      $window.history.back();
  }
 $scope.onlineStatus = onlineStatus;
 $scope.doRefresh = function() {
  if($scope.onlineStatus.onLine == true) {
      $timeout (function(){
     var user_id = $localStorage.userdata.user.person.id;
      $http.get('http://52.69.108.195:1337/ticket?ticket_type=Urilga&ticket_user='+user_id).success(function (response){
        $scope.tickets = response;
           $ionicSlideBoxDelegate.update();
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
  }

 window.onload = $scope.doRefresh();

       $ionicModal.fromTemplateUrl('templates/barcode.html', {
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

.controller('TicketCtrl',function($scope,$ionicPopup,$cordovaLocalNotification,onlineStatus,$ionicLoading,$state,$ionicSlideBoxDelegate,$localStorage,$http,$timeout,$window){
    
 $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  }); 


    $timeout(function(){
         $ionicSlideBoxDelegate.update();
             $scope.sendNotification();
    },1000);

     $scope.sendNotification = function () {
      console.log($scope.tickets);
      for (i in $scope.tickets ){
             $cordovaLocalNotification.schedule({
        id: i,
        title: $scope.tickets[i].ticket_description,
        text: $scope.tickets[i].ticket_email,
        data: {
          customProperty: 'custom value'
        }
      }).then(function (result) {
        alert('Send sendNotification');
      });
      }
   
    };

$scope.acceptTicket = function(data){
  var mydata = {};
  mydata.id = data.id;
  mydata.ticket_isActive = true;
  $http.put('http://52.69.108.195:1337/ticket/'+mydata.id,mydata).success(function (response){
    $scope.doRefresh();
  })
  console.log('accepted');
}
$scope.deleteTicket = function(data){
  var mydata = {};
  mydata.id = data.id;
   $http.delete('http://52.69.108.195:1337/ticket/'+mydata.id).success(function (response){
    console.log('rejected');
    $scope.doRefresh();
   })
  
}
$scope.onlineStatus = onlineStatus;
$scope.doRefresh = function() {
    if($scope.onlineStatus.onLine == true){
      $timeout (function(){
     var user_id = $localStorage.userdata.user.person.id;
      $http.get('http://52.69.108.195:1337/ticket?ticket_type=Free&ticket_type=Paid&ticket_user='+user_id).success(function (response){
        $scope.tickets = response;
        $ionicSlideBoxDelegate.update();
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
  }

 window.onload = $scope.doRefresh();
    $scope.goBack = function(){
      $window.history.back();
  };

})

.controller('ticketNumberCtrl', function($scope,$http,$ionicLoading,$stateParams,$localStorage,$timeout,$window) {
 
    $scope.goBack = function(){
      $window.history.back();
  };


  var user_id = $localStorage.userdata.user.person.id;
  $scope.doRefresh = function() {
  $timeout(function(){
         $ionicLoading.show({
               content: 'Loading',
               animation: 'fade-in',
               showBackdrop: true,
               maxWidth: 200,
               showDelay: 0
          })     
          $http.get('http://52.69.108.195:1337/ticket?ticket_type=Paid&ticket_type=Free&ticket_user='+user_id+'&ticket_event='+$stateParams.playlistId).success(function (response){
        $scope.TicketOfEvent = response;
        $ionicLoading.hide();
  })
          $scope.$broadcast('scroll.refreshComplete');  
  },1000);
  }
  window.onload = $scope.doRefresh();
})

.controller('MainCtrl',function($scope,onlineStatus,$cordovaOauth,$cordovaToast,$state,$ionicPopup,$localStorage,$http,$facebook,$ionicLoading,$window,$timeout){


$scope.facebookLogin = function() {
        $cordovaOauth.facebook("437722666411868", ["email"], {"auth_type": "rerequest"}).then(function (result) {
            console.log(JSON.stringify(result));
     var alertPopup = $ionicPopup.alert({
     title: 'Result',
     template: result
   });
        }, function(error) {
            console.log(JSON.stringify(error));
        });
    }

  $scope.isLoggedIn = false;
  $scope.fbLogin = function(){
   $facebook.login().then(function(){
        $scope.isLoggedIn = true;
        refresh();
        $localStorage.isLoggedIn = $scope.isLoggedIn;
        console.log('logged in');
    });
  }

  $scope.email = {checked:$localStorage.checked};

  $scope.emailSave = function() {
    if($scope.email.checked == true) {
        if($localStorage.userdata !== undefined){
           $localStorage.checked = true;
           $scope.emails = $localStorage.userdata.user.email;
        }
        else {
          console.log('Null');
         }
        }
    else {
      if($localStorage.userdata !== undefined){
            $localStorage.checked= false;
            $scope.emails = null;
      }
  
    }
  }

  function refresh() {

    $facebook.api("/me?fields=last_name, first_name, email, gender, locale, link").then( 
      function(response) {
        $scope.welcomeMsg = "Welcome " + response.name;
        $scope.isLoggedIn=true;
        $scope.fbUser = response;
        console.log($scope.fbUser);
                console.log($scope.fbUser.email);
        $facebook.api('/me/picture').then(function(response){
          $scope.picture = response.data.url;
          console.log($scope.picture);
              $facebook.api('/me/permissions').then(function(response){
          $scope.permissions = response.data;
        });
        });
        $http.get("http://52.69.108.195:1337/person?person_email="+$scope.fbUser.email).success(function (data){
            if(data[0]){
              console.log(data[0]);
              $localStorage.userdata = data[0];
              $http.post("http://52.69.108.195:1337/login",{email:"tugu0405@gmail.com",password:"123456"}).success(function(response){
                  if(response.status == true) {
                          $localStorage.userdata = response;
                          $state.go('app.playlists',{},{reload:true});
                  }
                  else {
                       $cordovaToast.show(response.message,'short','bottom');

                  }
              })
        
            }else{
              console.log("bgui");
            }
        }) 
      },
      function(err) {
        $scope.welcomeMsg = "Please log in";
      });
  }

  refresh();


  $scope.onlineStatus = onlineStatus;
  $scope.autoLogin = function() {
    if($scope.onlineStatus.onLine == true){
    if($localStorage.loginData !== undefined ){
      $ionicLoading.show({
               content: 'Loading',
               animation: 'fade-in',
               showBackdrop: true,
               maxWidth: 200,
               showDelay: 0
})
        $scope.emails = $localStorage.loginData.email;
        $scope.pass = $localStorage.loginData.pass;
         $http.post("http://52.69.108.195:1337/login",{email:$scope.emails,password:$scope.pass}).success(function (response){
          if(response.status == true) {
             $localStorage.userdata = response;
             $state.go('app.playlists',{},{reload:true});
          }
         })
        }
    else{
      console.log('hooson bna');
    }
  }
  else {
     var alertPopup = $ionicPopup.alert({
                   okType :'button-assertive',
                 template: 'Интернет холболтоо шалгана уу'
               });
}
  }


//$scope.autoLogin();
   

  $scope.login = function(data) {
    if($scope.onlineStatus.onLine == true){
    if(!data || !data.email || !data.pass ){
         var alertPopup = $ionicPopup.alert({
       okType :'button-assertive',
     template: 'Бүх талбарыг бөглөнө үү'
   });
    }
    else {

    $http.post("http://52.69.108.195:1337/login",{email:data.email,password:data.pass}).success(function (response) {
        if (response.status == true){   
                                      $ionicLoading.show({
               content: 'Loading',
               animation: 'fade-in',
               showBackdrop: true,
               maxWidth: 200,
               showDelay: 0
})     
                            $localStorage.loginData = data;    
                            $localStorage.userdata = response;
                                    $ionicLoading.hide();
                                   $state.go('app.playlists',{},{reload:true});
        }
        else {
                var alertPopup = $ionicPopup.alert({
       okType :'button-assertive',
     template: response.message
   });
        }
      })
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

.controller('SavedItemCtrl',function($timeout,$ionicHistory,$scope,$state,onlineStatus,$ionicPopup,$ionicLoading,$localStorage,$http,$stateParams,$window){
                               
                                $ionicLoading.show({
                                  content: 'Loading',
                                  animation: 'fade-in',
                                  showBackdrop: true,
                                  maxWidth: 200,
                                  showDelay: 0
                                });

      $scope.onlineStatus = onlineStatus;
     $scope.doRefresh = function() {
      if($scope.onlineStatus.onLine == true){
      $timeout (function(){
      $http.get("http://52.69.108.195:1337/eventlike?liked_by="+person_id).success(function (response){
            $scope.likedEvent = response;
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

  window.onload = $scope.doRefresh();
setInterval(function(){
  $scope.doRefresh();
},1000);
    $scope.goBack = function(){
      $scope.doRefresh();
      $window.history.back();
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
        $http.get("http://52.69.108.195:1337/eventlike?event_info="+event_id+"&liked_by="+person_id).success(function (response) {
          var delete_event_id = response[0].id;
             $http.delete("http://52.69.108.195:1337/eventlike/"+delete_event_id).success(function (response){
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

.controller('JoinedItemCtrl',function($timeout,$ionicHistory,$scope,$state,onlineStatus,$ionicPopup,$ionicLoading,$localStorage,$http,$stateParams,$window){
                               
                                $ionicLoading.show({
                                  content: 'Loading',
                                  animation: 'fade-in',
                                  showBackdrop: true,
                                  maxWidth: 200,
                                  showDelay: 0
                                });

      $scope.onlineStatus = onlineStatus;
     $scope.doRefresh = function() {
      if($scope.onlineStatus.onLine == true){
      $timeout (function(){
      $http.get("http://52.69.108.195:1337/eventjoin?joined_by="+person_id).success(function (response){
            $scope.joinedEvent = response;
      })
       $scope.$broadcast('scroll.refreshComplete');
       $ionicLoading.hide();
      },1000);
    }
    else {
        var alertPopup = $ionicPopup.alert({
                 template: 'Интернет холболтоо шалгана уу',
                 okType:'button-assertive'
               });
               alertPopup.then(function(res) {
                 $scope.$broadcast('scroll.refreshComplete');
               });
    }
  }

  window.onload = $scope.doRefresh();

    $scope.goBack = function(){
      $scope.doRefresh();
      $window.history.back();
  }
    var person_id = $localStorage.userdata.user.person.id;
    $scope.deletejoinedEvent = function(data){
             var confirmPopup = $ionicPopup.confirm({
     template: 'Устгахдаа итгэлтэй байна уу?',
     okType : 'button-assertive'
   });
   confirmPopup.then(function(res) {
     if(res) {
        var event_id = data;
        $http.get("http://52.69.108.195:1337/eventjoin?event_info="+event_id+"&joined_by="+person_id).success(function (response) {
          var delete_event_id = response[0].id;
             $http.delete("http://52.69.108.195:1337/eventjoin/"+delete_event_id).success(function (response){
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



.controller('RegCtrl',function($scope,$state,onlineStatus,$cordovaCamera,$cordovaToast,$ionicPopup,$http,$window){
  
  $scope.goBack = function(){
      $window.history.back();
  }
  $scope.onlineStatus = onlineStatus;
   $scope.Register = function(data) {
    if($scope.onlineStatus.onLine == true){
    if (!data || !data.uname || !data.pass || !data.email || !data.phone || !data.fname || !data.register_id) {
             var alertPopup = $ionicPopup.alert({
     template: 'Бүх талбарыг бөглөнө үү',
     okType : 'button-assertive'
   });
    }
    else {
      $http.post("http://52.69.108.195:1337/person", {person_firstname:data.fname,person_lastname:data.uname,person_register_id:data.register_id,person_email:data.email,person_cell_number:data.phone}).success(function (response) {
              var person_id = response.id;
        $http.post("http://52.69.108.195:1337/user",{email:data.email,person:person_id,password:data.pass}).success(function(){
               var alertPopup = $ionicPopup.alert({
     template: 'Амжилттай бүртгүүллээ',
     okType :'button-assertive'
   });
   alertPopup.then(function(res) {
   $state.go('main',{},{reload:true});
      });
        })
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

.controller('ForgotPasswordCtrl',function($scope,$state,$window){
    $scope.goBack = function(){
      $window.history.back();
  };
})

.controller('HomeCtrl',function($scope,$state,$window){
  $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    }
    $scope.goBack = function(){
      $window.history.back();
  };
})

.controller('ticketImgCtrl',function($scope,$state,$window,$ionicModal,$http,$localStorage,$stateParams,$ionicSlideBoxDelegate){
      var user_id = $localStorage.userdata.user.person.id;
      $scope.doRefresh = function(){
     $http.get('http://52.69.108.195:1337/ticket/'+$stateParams.eventId).success(function (response){
        $scope.ticket = response;
        $ionicSlideBoxDelegate.update();
        var ticket_countof=[];
        for( i = 0; i < $scope.ticket.ticket_countof;i++){
          ticket_countof.push(i)
        }
        $scope.countof = ticket_countof;
    })
   }
   window.onload = $scope.doRefresh();

     $scope.deleteTicket = function(data){
  var mydata = {};
  mydata.id = data.id;
   $http.delete('http://52.69.108.195:1337/ticket/'+mydata.id).success(function (response){
    console.log('rejected');
    $state.go('app.myticket');
    $scope.doRefresh();
   })
  
}
   $ionicModal.fromTemplateUrl('templates/barcode.html', {
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
.controller('buyticketImgCtrl',function($scope,$state,$window,$ionicModal,$http,$localStorage,$stateParams,$ionicSlideBoxDelegate){
      var user_id = $localStorage.userdata.user.person.id;
      $scope.doRefresh = function(){
     $http.get('http://52.69.108.195:1337/ticket/'+$stateParams.eventId).success(function (response){
        $scope.ticket = response;
        $ionicSlideBoxDelegate.update();
        var ticket_countof=[];
        for( i = 0; i < $scope.ticket.ticket_countof;i++){
          ticket_countof.push(i)
        }
        $scope.countof = ticket_countof;
    })
   }
   window.onload = $scope.doRefresh();

     $scope.deleteTicket = function(data){
  var mydata = {};
  mydata.id = data.id;
   $http.delete('http://52.69.108.195:1337/ticket/'+mydata.id).success(function (response){
    console.log('rejected');
    $state.go('app.myticket');
    $scope.doRefresh();
   })
  
}
   $ionicModal.fromTemplateUrl('templates/barcode.html', {
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
      $window.history.go(-2);
  };
})
.controller('PlaylistCtrl', function($scope,$ionicLoading,onlineStatus,$cordovaSocialSharing,$stateParams,$timeout,$ionicLoading,$http,$localStorage,$ionicPopup,$ionicModal,$window) {
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  }); 

if(onlineStatus.onLine ==true){
 $http.get("http://52.69.108.195:1337/event/"+$stateParams.playlistId).success(function (response) {
        $scope.list = response;
  $http.get("http://52.69.108.195:1337/agenda?agenda_event="+$scope.list.id).success(function (response){
        $scope.agendas = response;
        $ionicLoading.hide();
  });
  });
}
else {
                   $ionicLoading.hide();
    var alertPopup = $ionicPopup.alert({
                 template: 'Интернет холболтоо шалгана уу',
                   okType :'button-assertive'
               });
          
          
}
$scope.checkAll = function() {
  $http.get("http://52.69.108.195:1337/eventlike?event_info="+$stateParams.playlistId).success(function (response){
    $scope.eventlike = response;
  })
    $http.get("http://52.69.108.195:1337/ticket?ticket_event="+$stateParams.playlistId).success(function (response){
    $scope.going = response;
  })
       $http.get("http://52.69.108.195:1337/eventjoin?event_info="+$stateParams.playlistId).success(function (response){
    $scope.join = response;
  })
}
  setInterval(function(){
    $scope.checkAll();
  },1000);


$scope.backsite = "http://52.69.108.195:1337";
 $scope.agenda_times = function(id){
    $http.get("http://52.69.108.195:1337/agendatime?time_agenda="+id).success(function (response){
      $scope.agenda_times = response;
    })
 }

  $scope.shareAnywhere = function() {
    $cordovaSocialSharing.share($scope.list.event_title, null, null, 'http://52.69.108.195:9000/#/event_details/'+$scope.list.id);
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

    $scope.imageSrc = 'http://ionicframework.com/img/ionic-logo-blog.png';

    $scope.showImage = function(){
      $scope.imageSrc = 'http://52.69.108.195:1337/'+$scope.list.event_cover;
      $scope.openModal();
    }
      $scope.goBack = function(){
      $window.history.back();
      };
  var person_id = $localStorage.userdata.user.person.id;

    $scope.checkTicket = function(){
        var event_id = $scope.list.id;
        $http.get('http://52.69.108.195:1337/ticket?ticket_type=Paid&ticket_type=Free&ticket_user='+person_id+'&ticket_event='+event_id).success(function (response){
          if(response.length>0){
         $scope.checkTicket = response;
         $scope.check = 1;
          }
          else {
            console.log('alga');
          }
        })
    };


    
    $scope.checkLike = function(){
         var event_id = $scope.list.id;
      $http.get("http://52.69.108.195:1337/eventlike?event_info="+event_id+"&liked_by="+person_id).success(function (response) {
              if(response.length>0) {
                $scope.liker_function = 1;
              }        
              else {
                $scope.liker_function = 0;
              }
      })
    };

    $scope.checkJoin = function(){
        var event_id = $scope.list.id;
        $http.get("http://52.69.108.195:1337/eventjoin?event_info="+event_id+"&joined_by="+person_id).success(function (response){
            if(response.length>0){
              $scope.join_value = 1;
            }
            else {
              $scope.join_value = 0;
            }
        })
    }

    $scope.joinEvent = function(){
        var event_id = $scope.list.id;
        var person_id = $localStorage.userdata.user.person.id;
        $http.post("http://52.69.108.195:1337/eventjoin",{event_info:event_id,joined_by:person_id}).success(function (response){
            console.log('success');
            $scope.join_value = 1;
        })
    }

    $scope.unjoinEvent = function(){
       var event_id = $scope.list.id;
      $http.get("http://52.69.108.195:1337/eventjoin?event_info="+event_id+"&joined_by="+person_id).success(function (response){
        var id = response[0].id;
        $http.delete("http://52.69.108.195:1337/eventjoin/"+id).success(function (response){
          if(response.state == 'OK'){
            console.log('deleted');
            $scope.join_value = 0;
          }
        })
      })
    }

    $scope.unlikeEvent = function(){
          var event_id = $scope.list.id;
        $http.get("http://52.69.108.195:1337/eventlike?event_info="+event_id+"&liked_by="+person_id).success(function (response) {
             var id = response[0].id;
             $http.delete("http://52.69.108.195:1337/eventlike/"+id).success(function (response){
              if(response.state == 'OK'){
                  console.log('deleted');
                  $scope.liker_function = 0;
            }
          })
        });
     } ;
  $scope.likeEvent = function(){
    var person_id = $localStorage.userdata.user.person.id;
     $http.post("http://52.69.108.195:1337/eventlike",{event_info:$scope.list.id,liked_by:person_id}).success(function (response){
        console.log('success');
        $scope.liker_function=1;
     });
  } 

  $timeout(function(){
    $scope.checkTicket();
    $scope.checkLike();
    $scope.checkJoin();
    $scope.$apply();
     },1000)
  ;
});

