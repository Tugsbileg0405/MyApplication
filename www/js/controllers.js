angular.module('starter.controllers', [])




.controller('AppCtrl', function($scope,$facebook,$state, $timeout,$ionicLoading,$localStorage,$ionicHistory,$http,$window) {
  

      var user_id = $localStorage.userdata.user.person.id;

      $http.get('http://52.69.108.195:1337/ticket?ticket_user='+user_id).success(function (response){
        $scope.tickets = response;
      });

      $http.get("http://52.69.108.195:1337/eventlike?liked_by="+user_id).success(function (response){
            $scope.likedEvent = response;
      })
   

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  }

  $scope.userdata = $localStorage.userdata;



  $scope.logout = function(){
    $http.get('http://52.69.108.195:1337/logout').success(function (response){
        console.log(response);
              localStorage.clear();
              $state.go('homeLogin',{},{reload:true});
    })
  };
})



.controller('PlaylistsCtrl', function($scope,$rootScope,$cordovaNetwork,$timeout,$http,$ionicLoading,$localStorage,$ionicScrollDelegate) {

$scope.numberOfItemsToDisplay = 10;
    $scope.loadMore = function() {
      if($scope.lists.length > $scope.numberOfItemsToDisplay){
        $scope.numberOfItemsToDisplay +=10;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
  };
  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadMore();
  });



    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
      var onlineState = networkState;
      alert(onlineState);
      $('#myBody').html();
      })

    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      var offlineState = networkState;
      alert(offlineState);
      $('#myBody').text("Connection Lost");
    })



 $scope.doRefresh = function() {
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
           }
           else if (tomorrow_date == $scope.event_date) {
            $scope.tomorrow_event.push($scope.lists[i]);
           }
           else if (tomorrow < event_mill) {
            $scope.upcoming_event.push($scope.lists[i])
           }
           else {
            $scope.message = 'Хараахан мэдээлэл ороогүй байна.';
           }
      }
   
   
    })
       $scope.$broadcast('scroll.refreshComplete');
      },1000);
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

.controller('ProfileCtrl',function($scope,$localStorage,$window,$state,$timeout){
  
      $scope.userdata = $localStorage.userdata;
      $scope.goBack = function(){
      $window.history.back();
  };
})

.controller('buyTicketCtrl',function($scope,$cordovaToast,$localStorage,$stateParams,$http,$window,$state,$timeout,$ionicLoading,$ionicPopup){
 
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
    $scope.ticket.ticket_fullname = $localStorage.userdata.user.person.person_firstname+$localStorage.userdata.user.person.person_lastname;
    $scope.ticket.ticket_email =$localStorage.userdata.user.person.person_email;
    $scope.ticket.ticket_phonenumber = $localStorage.userdata.user.person.person_cell_number;
  }

  $scope.clear = function(ticket){
  ticket.ticket_fullname = "";
  ticket.ticket_email = "";
  ticket.ticket_phonenumber = "";
};

  $scope.buyTicket = function(ticket){
     $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
    $scope.mydata = ticket;
    $scope.mydata.ticket_countof = $scope.ticket_counter;
    $scope.mydata.ticket_user = user_id; 
    $scope.mydata.ticket_event = $stateParams.playlistId;
    $scope.mydata.ticket_user_email = $localStorage.userdata.user.person.person_email;
    $scope.mydata.ticket_user_name = $localStorage.userdata.user.person.person_lastname;
    $http.post('http://52.69.108.195:1337/ticket',$scope.mydata).success(function (response){
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
     title: 'Тасалбар худалдан авалт',
     template: 'Амжилттай'
   });
   alertPopup.then(function(res) {
        $state.go('app.playlists',{},{reload:true});
   });
    })
  }

      $scope.goBack = function(){
      $window.history.back();
  };
})


.controller('myEventCtrl',function($scope,$localStorage,$ionicLoading,$http,$window,$state,$timeout){
     $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

$scope.doRefresh = function(){
  $timeout(function(){
       $http.get('http://52.69.108.195:1337/event?event_created_by='+user_id).success(function (response){
      $scope.myEvents = response;
   })
       $scope.$broadcast('scroll.refreshComplete');
  },1000);
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

.controller('myOrgCtrl',function($scope,$localStorage,$ionicLoading,$http,$window,$state,$timeout){
     $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

$scope.doRefresh = function(){
  $timeout(function(){
       $http.get('http://52.69.108.195:1337/org?organization_created_by='+user_id).success(function (response){
      $scope.myOrgs = response;
   })
       $scope.$broadcast('scroll.refreshComplete');
  },1000);
}

window.onload = $scope.doRefresh();

 var user_id = $localStorage.userdata.user.person.id;
  $http.get('http://52.69.108.195:1337/org?organization_created_by='+user_id).success(function (response){
    if(response.length>0){
    $scope.myOrgs = response;
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

.controller('OrgCtrl',function($scope,$localStorage,$ionicLoading,$http,$window,$state,$timeout,$stateParams){
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
  
      $scope.goBack = function(){
      $window.history.back();
  };
})

.controller('CategoryItemCtrl', function($scope,$ionicLoading,$timeout,$http,$stateParams,$window) {     
 $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

 $scope.doRefresh = function() {
      $timeout (function(){
    $http.get('http://52.69.108.195:1337/category/'+$stateParams.category_Id).success(function (response){
    $scope.items = response;
    })
       $scope.$broadcast('scroll.refreshComplete');
      },1000);
  },


   window.onload = $scope.doRefresh();

      $scope.goBack = function(){
      $window.history.back();
  }

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
})

.controller('InvitationCtrl', function($scope,$ionicLoading,$timeout,$http,$stateParams,$localStorage,$ionicModal,$ionicSlideBoxDelegate,$window) {

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
  

      $scope.goBack = function(){
      $window.history.back();
  }
 
 $scope.doRefresh = function() {
      $timeout (function(){
     var user_id = $localStorage.userdata.user.person.id;
      $http.get('http://52.69.108.195:1337/ticket?ticket_user='+user_id).success(function (response){
        $scope.tickets = response;
        $ionicSlideBoxDelegate.update();
        $ionicLoading.hide();
    })
       $scope.$broadcast('scroll.refreshComplete');
      },1000);
  }

 window.onload = $scope.doRefresh();

       $ionicModal.fromTemplateUrl('templates/urilgaDetail.html', {
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

.controller('TicketCtrl',function($scope,$ionicLoading,$state,$ionicSlideBoxDelegate,$localStorage,$http,$timeout,$window){
    
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



$scope.doRefresh = function() {
      $timeout (function(){
     var user_id = $localStorage.userdata.user.person.id;
      $http.get('http://52.69.108.195:1337/ticket?ticket_user='+user_id).success(function (response){
        $scope.tickets = response;
        $ionicSlideBoxDelegate.update();
        $ionicLoading.hide();
    })
       $scope.$broadcast('scroll.refreshComplete');
      },1000);
  }

 window.onload = $scope.doRefresh();

    $scope.goBack = function(){
      $window.history.back();
  };

})

.controller('ticketNumberCtrl', function($scope,$http,$stateParams,$localStorage,$timeout,$window) {
 
    $scope.goBack = function(){
      $window.history.back();
  };


  var user_id = $localStorage.userdata.user.person.id;
  $scope.doRefresh = function() {
  $timeout(function(){
          $http.get('http://52.69.108.195:1337/ticket?ticket_user='+user_id+'&ticket_event='+$stateParams.playlistId).success(function (response){
        $scope.TicketOfEvent = response;
        console.log($scope.TicketOfEvent);
  })
          $scope.$broadcast('scroll.refreshComplete');  
  },1000);
  }
  window.onload = $scope.doRefresh();
})

.controller('MainCtrl',function($scope,$cordovaOauth,$cordovaToast,$state,$ionicPopup,$localStorage,$http,$facebook,$ionicLoading,$window,$timeout){

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

  $scope.autoLogin = function() {
     $ionicLoading.show({
                                  content: 'Loading',
                                  animation: 'fade-in',
                                  showBackdrop: true,
                                  maxWidth: 200,
                                  showDelay: 0
                                });
    if($localStorage.loginData !== undefined ){
        $scope.emails = $localStorage.loginData.email;
        $scope.pass = $localStorage.loginData.pass;
        $timeout(function(){
              $scope.login({email:$scope.emails,pass:$scope.pass});
              $ionicLoading.hide();
        },500);
        }
    else{
      console.log('hooson bna');
       $ionicLoading.hide();
    }
  }
   document.addEventListener("deviceready", function(){
    $scope.autoLogin();
   });

   $scope.autoLogin();

  $scope.login = function(data) {
    if(!data || !data.email || !data.pass ){
         var alertPopup = $ionicPopup.alert({
     title: 'Алдаа',
     template: 'Бүх талбарыг бөглөнө үү'
   });
    }
    else {

    $http.post("http://52.69.108.195:1337/login",{email:data.email,password:data.pass}).success(function (response) {
               
        if (response.status == true){   
                            $localStorage.loginData = data;    
                            $localStorage.userdata = response;
                            console.log($localStorage.userdata);
                                    $ionicLoading.hide();
                                   $state.go('app.playlists',{},{reload:true});
        }
        else {
                var alertPopup = $ionicPopup.alert({
     title: 'Алдаа',
     template: response.message
   });
        }
      })
 }
};
})

.controller('SavedItemCtrl',function($timeout,$scope,$state,$ionicPopup,$ionicLoading,$localStorage,$http,$stateParams,$window){
                               
                                $ionicLoading.show({
                                  content: 'Loading',
                                  animation: 'fade-in',
                                  showBackdrop: true,
                                  maxWidth: 200,
                                  showDelay: 0
                                });

     $scope.doRefresh = function() {
      $timeout (function(){
      $http.get("http://52.69.108.195:1337/eventlike?liked_by="+person_id).success(function (response){
            $scope.likedEvent = response;
      })
       $scope.$broadcast('scroll.refreshComplete');
       $ionicLoading.hide();
      },1000);
  }

  window.onload = $scope.doRefresh();

    $scope.goBack = function(){
      $scope.doRefresh();
      $window.history.back();
  }
    var person_id = $localStorage.userdata.user.person.id;
    $scope.deleteSavedEvent = function(data){
             var confirmPopup = $ionicPopup.confirm({
     title: 'Хадгалагдсан арга хэмжээ',
     template: 'Устгахдаа итгэлтэй байна уу?'
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



.controller('RegCtrl',function($scope,$state,$cordovaCamera,$cordovaToast,Todo,$ionicPopup,$http,$window){
  
  $scope.goBack = function(){
      $window.history.back();
  }

   $scope.Register = function(data) {
    console.log(data);
    if (!data || !data.uname || !data.pass || !data.email || !data.phone || !data.fname || !data.register_id) {
            $cordovaToast.show('Бүх талбарыг бөглөнө үү','short','bottom');
    }
    else {
      $http.post("http://52.69.108.195:1337/person", {person_firstname:data.fname,person_lastname:data.uname,person_register_id:data.register_id,person_email:data.email,person_cell_number:data.phone}).success(function (response) {
              var person_id = response.id;
        $http.post("http://52.69.108.195:1337/user",{email:data.email,person:person_id,password:data.pass}).success(function(){
               var alertPopup = $ionicPopup.alert({
     title: 'Мэдээлэл',
     template: 'Амжилттай бүртгүүллээ'
   });
   alertPopup.then(function(res) {
   $state.go('main',{},{reload:true});
   });
        })
        })
   }  
 }
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

.controller('ticketImgCtrl',function($scope,$window){
        $scope.goBack = function(){
      $window.history.back();
  };
})

.controller('PlaylistCtrl', function($scope,$ionicLoading,$cordovaSocialSharing,$stateParams,$timeout,$ionicLoading,$http,$localStorage,$ionicPopup,$ionicModal,$window) {
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  }); 


 $http.get("http://52.69.108.195:1337/event/"+$stateParams.playlistId).success(function (response) {
        $scope.list = response;
  $http.get("http://52.69.108.195:1337/agenda?agenda_event="+$scope.list.id).success(function (response){
        $scope.agendas = response;
        $ionicLoading.hide();
  });
  });

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
        $http.get('http://52.69.108.195:1337/ticket?ticket_user='+person_id+'&ticket_event='+event_id).success(function (response){
          if(response.length>0){
         $scope.checkTicket = response;
         $scope.check = 1;
          console.log($scope.checkTicket);
          }
          else {
            console.log('alga');
          }
        })
    }


    
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
         console.log($scope.liker_function);
     });
  } 

  $timeout(function(){
    $scope.checkTicket();
    $scope.checkLike();
    $scope.$apply();
     },1000)
  ;
});

