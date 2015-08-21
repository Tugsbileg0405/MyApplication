angular.module('starter.controllers', [])




.controller('AppCtrl', function($scope,$state, $ionicModal, $timeout,$ionicLoading,$localStorage,$cordovaNetwork,$window,$ionicHistory) {
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

   $scope.myGoBack = function() {
    $ionicHistory.goBack();
  }

  $scope.userdata = $localStorage.userdata;

  $scope.logOut = function(){
    localStorage.clear();
    $state.go('main',null,{reload:true});
  };
})



.controller('PlaylistsCtrl', function($scope,$ionicSlideBoxDelegate,Todo,$timeout,$http,$stateParams,$ionicLoading,$localStorage,$location) {
  
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
    }),

  $scope.getlist= function(listid){
        for (var i = 0 ; i<playlists.lenght; i++) {
          if (listid === playlists[i].id) {
          return playlists[i];
        }
        };
  };
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

.controller('MainCtrl',function($scope,$state,Todo,$ionicPopup,$localStorage){



  $scope.login = function(data) {

    if(!data || !data.uname || !data.pass ){
      var alert = $ionicPopup.alert({
      title:'Error',
      template:'Fill all information'
    })
    }
    else {
      Todo.login().success(function(datas){
        var logindata = datas.results;
        for (var i = 0 ; i < logindata.length; i++) {
        if(logindata[i].Username == data.uname && logindata[i].Password == data.pass ) {
              var userdata = {
                 Username : logindata[i].Username,
                 Email : logindata[i].email,
                 Phone : logindata[i].phone
              }
              $localStorage.userdata = userdata;
              $state.go('app.playlists',{}, {reload:true}); 
            }
        }
      })
    }
 }
})

.controller('SavedItemCtrl',function($timeout,$scope,$state,$cordovaCamera,Todo,$ionicPopup,$localStorage){

    $scope.savedData = function(){
    $http.get("http://52.69.108.195:1337/event/"+$stateParams.playlistId).success(function (response) {
    $scope.list = response;
    console.log($scope.list);
    })



    }  


   
})


.controller('RegCtrl',function($scope,$state,$cordovaCamera,Todo,$ionicPopup){
 $scope.word = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
   $scope.Register = function(data) {
    console.log(data);
    if (!data || !data.uname || !data.pass || !data.email || !data.phone) {
      var alert = $ionicPopup.alert({
      title:'Error',
      template:'Fill all information'
    })
    }
    else {
      Todo.register({Username:data.uname,Password:data.pass,email:data.email,phone:data.phone}).success(function(data){
        $state.go('main');
      })
   }
   }  
})

.controller('ForgotPasswordCtrl',function($scope,$state){})

.controller('PlaylistCtrl', function($scope, $stateParams,Todo,$timeout,$ionicLoading,$http,$localStorage,$ionicPopup,$ionicModal) {
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
    $http.get("http://52.69.108.195:1337/event/"+$stateParams.playlistId).success(function (response) {
    var events =[];
    events = response;
    var alertPopup = $ionicPopup.alert({
                title: 'Information',
                template: 'Successfully Saved!'
            })
    console.log(events);
    $localStorage.events = events;
  })      
  };


});
