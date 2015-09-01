angular.module('starter.controllers', [])




.controller('AppCtrl', function($scope,$state, $ionicModal, $timeout,$ionicLoading,$localStorage,$cordovaNetwork,$ionicHistory,$http,$window) {
  

  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  $timeout(function() {
    $ionicLoading.hide();
  }, 1000);

      var user_id = $localStorage.userdata.user.person.id;
    console.log(user_id);
      $http.get('http://52.69.108.195:1337/ticket?ticket_user='+user_id).success(function (response){
        $scope.tickets = response;
        console.log($scope.tickets);
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



.controller('PlaylistsCtrl', function($scope,$ionicSlideBoxDelegate,$timeout,$http,$stateParams,$ionicLoading,$localStorage) {
  


  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  $timeout(function() {
    $ionicLoading.hide();
  }, 1500);

 $scope.doRefresh = function() {
      $timeout (function(){
      $http.get("http://52.69.108.195:1337/event").success(function (response) {
       $scope.lists.concat(response);
    })
       $scope.$broadcast('scroll.refreshComplete');
      },1000);
  },
  
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    }

  $http.get("http://52.69.108.195:1337/event").success(function (response) {
    $scope.lists = response;
  })

  $scope.baseURL = "http://52.69.108.195:1337/";
  $http.get('http://52.69.108.195:1337/category').success(function (response){
      $scope.categories = response;
    })


})

.controller('ProfileCtrl',function($scope,$localStorage,$window,$state){
      $scope.userdata = $localStorage.userdata;
      $scope.goBack = function(){
      $window.history.back();
  };
})

.controller('CategoryItemCtrl', function($scope,Todo,$timeout,$http,$stateParams,$window) {
  

 $scope.doRefresh = function() {
      $timeout (function(){
    $http.get('http://52.69.108.195:1337/category/'+$stateParams.category_Id).success(function (response){
    $scope.items = response;
    console.log($scope.items);
    })
       $scope.$broadcast('scroll.refreshComplete');
      },1000);
  },

      $scope.goBack = function(){
      $window.history.back();
  }

  $http.get('http://52.69.108.195:1337/category/'+$stateParams.category_Id).success(function (response){
    $scope.items = response;
    console.log($scope.items);
  });

})

.controller('InvitationCtrl', function($scope,$timeout,$http,$stateParams,$localStorage,$ionicModal,$cordovaLocalNotification,$ionicSlideBoxDelegate,$window) {

 
      $scope.goBack = function(){
      $window.history.back();
  }
 
    $scope.add = function() {
        var alarmtime = new Date();
        alarmtime.setMinutes(alarmtime.getMinutes()+1);
        $cordovaLocalNotification.add({
          id:"12345",
          data:alarmtime,
          message:'xaxa',
          title:'xaxa'
        }).then(function(){
          console.log('set');
        })
  }
 
 $scope.doRefresh = function() {
      $timeout (function(){
     var user_id = $localStorage.userdata.user.person.id;
    console.log(user_id);
      $http.get('http://52.69.108.195:1337/ticket?ticket_user='+user_id).success(function (response){
        $scope.tickets = response;
        console.log($scope.tickets);
    })
       $scope.$broadcast('scroll.refreshComplete');
      },1000);
  }

    var user_id = $localStorage.userdata.user.person.id;
    console.log(user_id);
      $http.get('http://52.69.108.195:1337/ticket?ticket_user='+user_id).success(function (response){
        $scope.tickets = response;
        console.log($scope.tickets);
      })

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
    };
  
    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };

    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
      console.log($scope.slideIndex);
    };
    
    $scope.show = function(data){
      $ionicSlideBoxDelegate.slide(data);
      $scope.openModal();
    }
      ;
})

.controller('MainCtrl',function($scope,$cordovaToast,$state,Todo,$ionicPopup,$localStorage,$http,$facebook,$ionicLoading,$window,$timeout){



  $scope.isLoggedIn = false;
  $scope.fbLogin = function(){
    $facebook.login().then(function(){
        $scope.isLoggedIn = true;
        refresh();
    });
  }
  $scope.fbLogout =function(){
    $facebook.logout().then(function(){
          $scope.isLoggedIn = false;
          refresh();
    });
  }
  $scope.reload = function() {
    $state.reload();
  }
  $scope.email = {checked:$localStorage.checked};

  $scope.emailSave = function(email) {
    if(email.checked == true) {
        $localStorage.checked = true;
        if($localStorage.userdata !== undefined  ){
        $scope.emails = $localStorage.userdata.user.email;
         }
         else {
          console.log('LocalStorage Null');
         }
    }
    else {
      $localStorage.checked= false;
      $scope.emails = null;
    }
  }


  function refresh() {
    $facebook.api("/me").then( 
      function(response) {
        $scope.welcomeMsg = "Welcome " + response.name;
        $scope.isLoggedIn=true;
        $scope.userinfo = response;
      },
      function(err) {
        $scope.welcomeMsg = "Please log in";
      });
  }

  $scope.autoLogin = function() {
    if($localStorage.userdata !== undefined ){
      $state.go('app.playlists',{},{reload:true});
    }
    else{
      $state.go('main',{},{reload:true});
    }
  }


  $scope.login = function(data) {
    console.log(data);
    if(!data || !data.email || !data.pass ){
        $cordovaToast.show('Бүх талбарыг бөглөнө үү','short','bottom');
    }
    else {
    $http.post("http://52.69.108.195:1337/login",{email:data.email,password:data.pass}).success(function (response) {
        console.log(response);
        if (response.status == true){      
                  $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                      });   
                      $timeout(function(){
                             $ionicLoading.hide();   
                            $localStorage.userdata = response;
                            $state.go('app.playlists',{},{reload:true});
                      },1000)         
        }
        else {
         var alert = $ionicPopup.alert({
         title:'Алдаа',
         template:response.message
    })
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

  $timeout(function() {
    $ionicLoading.hide();
  }, 1500);
    
     $scope.doRefresh = function() {
      $timeout (function(){
     console.log(person_id);
      $http.get("http://52.69.108.195:1337/eventlike?liked_by="+person_id).success(function (response){
            $scope.likedEvent = response;               
      })
       $scope.$broadcast('scroll.refreshComplete');
      },1000);
  }
  
  $scope.doRefresh();


    $scope.goBack = function(){
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
          console.log(event_id);
        $http.get("http://52.69.108.195:1337/eventlike?event_info="+event_id+"&liked_by="+person_id).success(function (response) {
            var deleteItem = response;
            console.log(deleteItem);
            for( i in deleteItem) {
              var id = deleteItem[i].id;
            }
             $http.delete("http://52.69.108.195:1337/eventlike/"+id).success(function (response){
              if(response.state == 'OK'){
              $scope.doRefresh();
            }
          })
        });
     } else {
       console.log('You are not sure');
     }
   });

    }



    console.log(person_id);
      $http.get("http://52.69.108.195:1337/eventlike?liked_by="+person_id).success(function (response){
        $scope.likedEvent = response;
        console.log($scope.likedEvent);
      });
    
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
      var alert = $ionicPopup.alert({
      title:'Бүртгүүлэлт',
      template:'Амжилттай бүртгүүллээ!'
    })
      alert.then(function (res){
              $state.go('main',{},{reload:true});
      })
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
  $scope.slideHasChanged = function(index) {
      $scope.slideIndex = index;
    }
    $scope.goBack = function(){
      $window.history.back();
  };
})

.controller('PlaylistCtrl', function($scope,$cordovaSocialSharing,$stateParams,Todo,$timeout,$ionicLoading,$http,$localStorage,$ionicPopup,$ionicModal,$window) {
$ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  }); 
  $timeout(function() {
    $ionicLoading.hide();
  }, 1500);

  $http.get("http://52.69.108.195:1337/event/"+$stateParams.playlistId).success(function (response) {
    $scope.list = response;
  $http.get("http://52.69.108.195:1337/agenda?agenda_event="+$scope.list.id).success(function (response){
    $scope.agendas = response;
    console.log($scope.agendas);
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

    
    $scope.checkLike = function(){
         var event_id = $scope.list.id;
      console.log(event_id);
      $http.get("http://52.69.108.195:1337/eventlike?event_info="+event_id+"&liked_by="+person_id).success(function (response) {
              if(response.length > 0) {
                $scope.liker_function = 1;
                         console.log($scope.liker_function);
              }        
              else {
                $scope.liker_function = 0;
                         console.log($scope.liker_function);
              }
      });
    };



    $scope.unlikeEvent = function(){
          var event_id = $scope.list.id;
          console.log(event_id);
        $http.get("http://52.69.108.195:1337/eventlike?event_info="+event_id+"&liked_by="+person_id).success(function (response) {
            var deleteItem = response;
            console.log(deleteItem);
            for( i in deleteItem) {
              var id = deleteItem[i].id;
            }
             $http.delete("http://52.69.108.195:1337/eventlike/"+id).success(function (response){
              if(response.state == 'OK'){
                  console.log('deleted');
                  $scope.heart_icon="fa-bookmark-o";
                  $scope.liker_function = 0;
                  console.log($scope.liker_function);
            }
          })
        });
     } ;

  $scope.likeEvent = function(){
    var person_id = $localStorage.userdata.user.person.id;
     console.log(person_id);
     console.log($scope.list.id);
     $http.post("http://52.69.108.195:1337/eventlike",{event_info:$scope.list.id,liked_by:person_id}).success(function (response){
        console.log('success');
        $scope.heart_icon = "fa-bookmark";
        $scope.liker_function=1;
         console.log($scope.liker_function);
     });
  } ;

  $timeout(function(){
    $scope.checkLike();
  },1000);

});

