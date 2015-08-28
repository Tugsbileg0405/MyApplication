// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','starter.controllers','starter.services','ui.router','ngCordova','ngMaterial','ionic-material','ngStorage','ngFacebook','tabSlideBox','ngRoute'])
.run(function($ionicPlatform,$rootScope,$ionicPopup,$rootScope,$rootScope,$location,$localStorage,$state,$window) {
    (function(){
     (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
   }())

  $ionicPlatform.ready(function() {
     
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.style(1);
    }

    $ionicPlatform.registerBackButtonAction(function(){
      if($state.current.name == 'app.playlists'){
        navigator.app.exitApp();
      }
      else {
        navigator.app.backHistory();
      }
    },100)

      if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                    $ionicPopup.alert({
                        title: "Интернет холболт",
                        content: "Та интернетэд холбогдож байж ашиглана уу"
                    })
                    .then(function(result) {
                        if(result) {
                            ionic.Platform.exitApp();
                        }
                    });
           }
    }
  });
})


.config(function($stateProvider, $urlRouterProvider,$facebookProvider) {
  $facebookProvider.setAppId('437722666411868');
  $facebookProvider.setPermissions("email,public_profile,user_posts,publish_actions,user_photos");
  $stateProvider
 .state('main',{
      url:'/main',
      templateUrl:'templates/login/mainlogin.html',
      controller:'MainCtrl'
    })

    .state('register',{
      url: '/register',
      templateUrl:'templates/login/register.html',
      controller:'RegCtrl'
    })

 

      .state('forgotpassword',{
      url: '/forgotpassword',
      templateUrl:'templates/login/forgotpassword.html',
      controller:'ForgotPasswordCtrl'
    })

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.saved', {
    url: '/saved',
    views: {
      'menuContent': {
        templateUrl: 'templates/saved.html',
        controller : 'SavedItemCtrl'
      }
    }
  })

  .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/login/profile.html',
          controller:'ProfileCtrl'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

 .state('app.categorevent', {
    url: '/category/:category_Id',
    views: {
      'menuContent': {
        templateUrl: 'templates/categoryItems.html',
        controller: 'CategoryItemCtrl'
      }
    }
  })

  .state('app.invitation', {
    url: '/invitation',
    views: {
      'menuContent': {
        templateUrl: 'templates/invitation.html',
        controller : 'InvitationCtrl'
      }
    }
  })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })
;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider
  .otherwise('/main');
});
