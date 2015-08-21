// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','starter.controllers','starter.services','ui.router','ngCordova','ngMaterial','ngStorage'])
.run(function($ionicPlatform,$ionicPopup) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
      cordova.plugins.Keyboard.show();
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
      if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                    $ionicPopup.confirm({
                        title: "Internet Disconnected",
                        content: "The internet is disconnected on your device."
                    })
                    .then(function(result) {
                        if(!result) {
                            ionic.Platform.exitApp();
                        }
                    });
           }
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

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
          templateUrl: 'templates/login/profile.html'
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
  $urlRouterProvider.otherwise('/main');
});
