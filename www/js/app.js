// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngResource','starter.gesture','ionic.service.core','me-lazyload','pascalprecht.translate','ionic.contrib.drawer','angular.filter','starter.controllers','ja.qr','ionicLazyLoad','starter.services','starter.auth','ngCordova','ui.router','ngMaterial','ionic-material','ngStorage','tabSlideBox','ngRoute'])
.run(function($ionicPlatform,$cordovaPush,$ionicLoading,myData,$rootScope,AuthService,$localStorage,$http,$ionicPopup,$timeout,$location,$localStorage,$state,$window) {
 $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState, fromStateParams) {
  if(toState.name.indexOf('app') !== -1 ) {

    if(!AuthService.getAuthStatus()) {
      event.preventDefault();
      $state.go('homeLogin',{},{reload:true});
    }
    
  }
})
 ImgCache.options.debug = true;
 ImgCache.options.chromeQuota = 50*1024*1024;  
 
 ImgCache.init(function() {
  console.log('ImgCache init: success!');
}, function(){
  console.log('ImgCache init: error! Check the log for errors');
});
 $rootScope.$on('$stateChangeSuccess',
  function(event, toState, toParams, fromState, fromParams) {
    $state.current = toState;
    if($state.current.name == 'app.playlists'){
      if(ionic.Platform.isAndroid())
      {
       var androidConfig = {
        "senderID": "997147934532",
      };

      document.addEventListener("deviceready", function(){

        $cordovaPush.register(androidConfig).then(function(result) {
          console.log(result);
        }, function(err) {
          console.log(err);
        })

        $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
          switch(notification.event) {
            case 'registered':
            if (notification.regid.length > 0 ) {
              console.log('registration ID = ' + notification.regid);
              myData.getpushtoken(notification.regid).success(function (response){
                if(!response[0]){
                  var pushdata = {};
                  pushdata.user = $localStorage.userdata.user.person.id;
                  pushdata.token = notification.regid;
                  pushdata.____token = 'dXJpbGdhbW5BY2Nlc3M';
                  myData.pushtoken(pushdata).success(function (result){
                    console.log(result);
                  })
                }
                else {
                  console.log('baina');
                }
              })
            }
            break;

            case 'message':
            console.log(message);
            break;

            case 'error':
            alert('GCM error = ' + notification.msg);
            break;

            default:
            alert('An unknown GCM event has occurred');
            break;
          }
        });

}, false);
}
if(ionic.Platform.isIOS())
{
 var iosConfig = {
  "badge": true,
  "sound": true,
  "alert": true,
};

document.addEventListener("deviceready", function(){
  $cordovaPush.register(iosConfig).then(function(deviceToken) {
      // Success -- send deviceToken to server, and store for future use
      console.log("deviceToken: " + deviceToken)
      myData.getpushtoken(deviceToken).success(function (response){
        if(!response[0]){
          var pushdata = {};
          pushdata.user = $localStorage.userdata.user.person.id;
          pushdata.token = deviceToken;
          pushdata.____token = 'dXJpbGdhbW5BY2Nlc3M';
          myData.pushtoken(pushdata).success(function (result){
            console.log(result);
          })
        }
        else {
          console.log('baina');
        }
      })
    }, function(err) {
      alert("Registration error: " + err)
    });


  $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
    if (notification.alert) {
      navigator.notification.alert(notification.alert);
    }

    if (notification.sound) {
      var snd = new Media(event.sound);
      snd.play();
    }

    if (notification.badge) {
      $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
          // Success!
        }, function(err) {
          // An error occurred. Show a message to the user
        });
    }
  });
}, false);
}
}
}
)



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
        $ionicLoading.hide();
        $ionicPopup.alert({
          okType: 'button-assertive',
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


.config(function($stateProvider,$rootScopeProvider,$translateProvider,$httpProvider,$ionicConfigProvider,$mdThemingProvider ,$urlRouterProvider,$mdGestureProvider) {
 $httpProvider.defaults.useXDomain = true;
 $rootScopeProvider.digestTtl(15);
 delete $httpProvider.defaults.headers.common['X-Requested-With'];
 $ionicConfigProvider.views.maxCache(5);
 var neonRedMap = $mdThemingProvider.extendPalette('orange', {
  '900': 'FF5700'
});

 $mdThemingProvider.definePalette('orange', neonRedMap);

 $mdThemingProvider.theme('default')
 .primaryPalette('grey',{
  'default' : 'A700'
});

 $translateProvider.translations('mn', {
  'Music': 'Урлаг соёл',
  'Food & Drink' : 'Хоол хүнс',
  'Classes' : 'Сургалт',
  'Arts' : 'Уран зураг',
  'Parties' : 'Үдэшлэг',
  'Sports & Wellness' : 'Спорт',
  'Networking' : 'Хурал зөвлөгөөн'

});
 $translateProvider.preferredLanguage('mn');

 $mdGestureProvider.skipClickHijack();
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

 .state('homeLogin',{
  url: '/homeLogin',
  templateUrl:'templates/HomeLogin.html',
  controller:'HomeCtrl'
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
 .state('app.changepass', {
  url: '/changepass',
  views: {
    'menuContent': {
      templateUrl: 'templates/changepass.html',
      controller : 'changePassCtrl'
    }
  }
})
 .state('app.joined', {
  url: '/joined',
  views: {
    'menuContent': {
      templateUrl: 'templates/joined.html',
      controller : 'JoinedItemCtrl'
    }
  }
})
 .state('app.myorg', {
  url: '/myorg',
  views: {
    'menuContent': {
      templateUrl: 'templates/myorg.html',
      controller : 'myOrgCtrl'
    }
  }
})

 .state('app.org', {
  url: '/myorg/:myOrgId',
  views: {
    'menuContent': {
      templateUrl: 'templates/org.html',
      controller : 'OrgCtrl'
    }
  }
})

 .state('app.myevent', {
  url: '/myevent',
  views: {
    'menuContent': {
      templateUrl: 'templates/myevent.html',
      controller : 'myEventCtrl'
    }
  }
})

 .state('app.myticket',{
  url: '/myticket',
  views: {
    'menuContent': {
      templateUrl:'templates/ticket.html',
      controller:'TicketCtrl'
    }
  }
})


 .state('app.todayEvent',{
  url: '/todayEvent',
  views: {
    'menuContent': {
      templateUrl:'templates/today.html',
      controller:'TodayCtrl'
    }
  }
})
 .state('app.eventImage',{
  url: '/myticket/:eventId/imageDetail',
  views: {
    'menuContent': {
      templateUrl:'templates/ticketImage.html',
      controller:'eventImgCtrl'
    }
  }
})


 .state('app.ticketImg',{
  url: '/myticket/:eventId/detail',
  views: {
    'menuContent': {
      templateUrl:'templates/ticketImg.html',
      controller:'ticketImgCtrl'
    }
  }
})

 .state('app.buyticketImg',{
  url: '/ticket/:eventId/detail',
  views: {
    'menuContent': {
      templateUrl:'templates/buyticketImg.html',
      controller:'buyticketImgCtrl'
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
 .state('app.playlists.tab1', {
  url: '/tab1',
  views: {
    'menuContent-1': {
      templateUrl: 'templates/test.html',
      controller: 'tab1Ctrl'
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
 .state('app.search', {
  url: '/search',
  views: {
    'menuContent': {
      templateUrl: 'templates/search.html',
      controller: 'searchCtrl'
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
 .state('app.buyticket', {
  url: '/playlists/:playlistId/buyticket',
  views: {
    'menuContent': {
      templateUrl: 'templates/buyticket.html',
      controller: 'buyTicketCtrl'
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
 .state('app.eventTicketNumber', {
  url: '/playlists/:playlistId/ticketNumber',
  views: {
    'menuContent': {
      templateUrl: 'templates/eventTicketNumber.html',
      controller: 'ticketNumberCtrl'
    }
  }
})
 ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider
  .otherwise('/app/playlists');
})
.directive('nxEqualEx', function() {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, model) {
      if (!attrs.nxEqualEx) {
        console.error('nxEqualEx expects a model as an argument!');
        return;
      }
      scope.$watch(attrs.nxEqualEx, function (value) {
                // Only compare values if the second ctrl has a value.
                if (model.$viewValue !== undefined && model.$viewValue !== '') {
                  model.$setValidity('nxEqualEx', value === model.$viewValue);
                }
              });
      model.$parsers.push(function (value) {
                // Mute the nxEqual error if the second ctrl is empty.
                if (value === undefined || value === '') {
                  model.$setValidity('nxEqualEx', true);
                  return value;
                }
                var isValid = value === scope.$eval(attrs.nxEqualEx);
                model.$setValidity('nxEqualEx', isValid);
                return isValid ? value : undefined;
              });
    }
  };
})
.directive('ngCache', function() {

        return {
            restrict: 'A',
            link: function(scope, el, attrs) {

                attrs.$observe('ngSrc', function(src) {

                    ImgCache.isCached(src, function(path, success) {
                        if (success) {
                            ImgCache.useCachedFile(el);
                        } else {
                            ImgCache.cacheFile(src, function() {
                                ImgCache.useCachedFile(el);
                            });
                        }
                    });

                });
            }
        };
    })

.directive('fallbackSrc', function () {
  var fallbackSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
        angular.element(this).attr("src", iAttrs.fallbackSrc);
      });
    }
  }
  return fallbackSrc;
})


;