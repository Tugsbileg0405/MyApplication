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
      });

  $scope.userdata = $localStorage.userdata;


  $scope.logout = function(){
    $http.get("http://52.69.108.195:1337/logout").success(function (response){
        console.log(response.status);
              localStorage.clear();
              $state.go('main',{},{reload:true});
    })
  };
})



.controller('PlaylistsCtrl', function($scope,ionicMaterialInk,ionicMaterialMotion,$ionicSlideBoxDelegate,Todo,$timeout,$http,$stateParams,$ionicLoading,$localStorage,$location) {
  


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

 $scope.doRefresh = function() {
      $timeout (function(){
      $http.get("http://52.69.108.195:1337/event").success(function (response) {
       $scope.lists = response;
    })
       $scope.$broadcast('scroll.refreshComplete');
      },1000);
  },
  

  $http.get("http://52.69.108.195:1337/event").success(function (response) {
    $scope.lists = response;
  })


  $http.get('http://52.69.108.195:1337/category').success(function (response){
      $scope.categories = response;
    });

})

.controller('CategoryItemCtrl', function($scope,Todo,$timeout,$http,$stateParams) {
  

 $scope.doRefresh = function() {
      $timeout (function(){
    $http.get('http://52.69.108.195:1337/category/'+$stateParams.category_Id).success(function (response){
    $scope.items = response;
    console.log($scope.items);
    })
       $scope.$broadcast('scroll.refreshComplete');
      },1000);
  },

  $http.get('http://52.69.108.195:1337/category/'+$stateParams.category_Id).success(function (response){
    $scope.items = response;
    console.log($scope.items);
  });

})

.controller('InvitationCtrl', function($scope,$timeout,$http,$stateParams,$localStorage) {

 
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
      ;
})

.controller('MainCtrl',function($scope,$state,Todo,$ionicPopup,$localStorage,$http,$facebook,$ionicLoading){



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

  $scope.login = function(data) {

    if(!data || !data.email || !data.pass ){
      var alert = $ionicPopup.alert({
      title:'Алдаа',
      template:'Бүх талбарыг бөглөнө үү!'
    })
    }
    else {
    $http.post("http://52.69.108.195:1337/login",{email:data.email,password:data.pass}).success(function (response) {
        if (response.status == true){                  
              $ionicLoading.hide();          
             $localStorage.userdata = response;
              $state.go('app.playlists',{},{reload:true});
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

.controller('SavedItemCtrl',function($timeout,$scope,$state,$ionicPopup,$localStorage,$http,$stateParams){
   
     $scope.doRefresh = function() {
      $timeout (function(){
     console.log(person_id);
      $http.get("http://52.69.108.195:1337/eventlike?liked_by="+person_id).success(function (response){
        $scope.likedEvent = response;
        console.log($scope.likedEvent);
      })
       $scope.$broadcast('scroll.refreshComplete');
      },1000);
  }

      var person_id = $localStorage.userdata.user.person.id;
    $scope.deleteSavedEvent = function(data){
          var event_id = data;
          console.log(event_id);
        $http.get("http://52.69.108.195:1337/eventlike?event_info="+event_id+"&liked_by="+person_id).success(function (response) {
            var deleteItem = response;
            console.log(deleteItem);
            for( i in deleteItem) {
              var id = deleteItem[i].id;
            }
             $http.delete("http://52.69.108.195:1337/eventlike/"+id).success(function (response){
               var alert = $ionicPopup.alert({
                  title:'Мэдээлэл',
                  template:'Амжилттай устлаа!'
                  })
              $scope.doRefresh();
          })
        });
    }



    console.log(person_id);
      $http.get("http://52.69.108.195:1337/eventlike?liked_by="+person_id).success(function (response){
        $scope.likedEvent = response;
        console.log($scope.likedEvent);
      });
    
  })



.controller('RegCtrl',function($scope,$state,$cordovaCamera,Todo,$ionicPopup,$http){
   $scope.Register = function(data) {
    console.log(data);
    if (!data || !data.uname || !data.pass || !data.email || !data.phone || !data.fname || !data.register_id) {
      var alert = $ionicPopup.alert({
      title:'Алдаа',
      template:'Бүх талбарыг бөглөнө үү!'
    })
    }
    else {

      
      $http.post("http://52.69.108.195:1337/person", {person_firstname:data.fname,person_lastname:data.uname,person_register_id:data.register_id,person_email:data.email,person_cell_number:data.phone}).success(function (response) {
              var person_id = response.id;
        $http.post("http://52.69.108.195:1337/user",{email:data.email,person:person_id,password:data.pass}).success(function(){
      var alert = $ionicPopup.alert({
      title:'Бүртгүүлэлт',
      template:'Амжилттай бүртгүүллээ!'
    })
      $state.go('main',{},{reload:true});
        })
        })
   }  
 }
})

.controller('ForgotPasswordCtrl',function($scope,$state){})

.controller('PlaylistCtrl', function($scope,$cordovaSocialSharing, $stateParams,Todo,$timeout,$ionicLoading,$http,$localStorage,$ionicPopup,$ionicModal,$window) {
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

  $http.get("http://52.69.108.195:1337/event/"+$stateParams.playlistId).success(function (response) {
    $scope.list = response;
  })

  $scope.shareAnywhere = function() {
    $cordovaSocialSharing,share("dada","dada",null,"https://urilga.mn"); 
     }


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
  


  $scope.saveEvent = function(){
    var person_id = $localStorage.userdata.user.person.id;
     console.log(person_id);
     console.log($scope.list.id);
     $http.post("http://52.69.108.195:1337/eventlike",{event_info:$scope.list.id,liked_by:person_id}).success(function (response){
       console.log(response);
        var alert = $ionicPopup.alert({
            title:'Мэдээлэл',
            template:'Амжилттай хадгалагдлаа!'
          })
     })
    
  };


});
