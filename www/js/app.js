// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ti-segmented-control','ngResource','ngCordovaOauth','ionic-native-transitions','angular-cache','ImgCache','starter.gesture','ionic.service.core','me-lazyload','pascalprecht.translate','ionic.contrib.drawer','angular.filter','starter.controllers','ja.qr','ionicLazyLoad','starter.services','starter.auth','ui.router','ngMaterial','ionic-material','ngStorage','tabSlideBox','ngRoute','ngCordova'])
.run(function($ionicPlatform,$cordovaSplashscreen,$cordovaPush,ImgCache,$ionicLoading,myData,$rootScope,AuthService,$localStorage,$http,$ionicPopup,$timeout,$location,$localStorage,$state,$window) {
 document.addEventListener("deviceready", function(){
     navigator.splashscreen.hide();
    ImgCache.init(function(){
        console.log('cache created successfully!');
    }, function(){
        console.log('check the log for errors');
    });
}, false);
 $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState, fromStateParams) {
  if(toState.name.indexOf('app') !== -1 ) {
    if(!AuthService.getAuthStatus()) {
      event.preventDefault();
      $state.go('main',{},{reload:true});
    }
  }
})
 $rootScope.$on('$stateChangeSuccess',
  function(event, toState, toParams, fromState, fromParams) {
    $state.current = toState;
    if($state.current.name == 'app.playlists'){

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
          pushdata.is_IOS = 1;
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
   if (navigator && navigator.splashscreen) {
          navigator.splashscreen.hide();
    }
 if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
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
            $ionicLoading.hide();
          }
        });
      }
    }
  });

})


.config(function($stateProvider,$ionicNativeTransitionsProvider,CacheFactoryProvider,ImgCacheProvider,$rootScopeProvider,$translateProvider,$httpProvider,$ionicConfigProvider,$mdThemingProvider ,$urlRouterProvider,$mdGestureProvider) {
 ImgCacheProvider.setOption('debug', false);
 ImgCacheProvider.setOption('usePersistentCache', true);
 ImgCacheProvider.setOptions({
  debug: false,
  usePersistentCache: true
});
 ImgCacheProvider.manualInit = true;
 angular.extend(CacheFactoryProvider.defaults, { maxAge: 15 * 60 * 1000 });
    // or more options at once
    $ionicNativeTransitionsProvider.setDefaultOptions({
        duration: 200, // in milliseconds (ms), default 400,
        slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
        iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
        androiddelay: -1, // same as above but for Android, default -1
        winphonedelay: -1, // same as above but for Windows Phone, default -1,
        fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
        fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
        triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
        backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
      });
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.cache = false;
    $rootScopeProvider.digestTtl(10);
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $ionicConfigProvider.views.maxCache(10);
    $ionicConfigProvider.views.swipeBackEnabled(false);
    $ionicConfigProvider.views.forwardCache(true);
    var neonRedMap = $mdThemingProvider.extendPalette('orange', {
      '900': 'FF5700'
    });

    $mdThemingProvider.definePalette('orange', neonRedMap);

    $mdThemingProvider.theme('default')
    .primaryPalette('grey',{
      'default' : 'A700'
    });

    $translateProvider.translations('mn', {
      'Music': 'Дуу хөгжим',
      'Food & Drink' : 'Хоол хүнс',
      'Classes' : 'Сургалт',
      'Arts' : 'Урлаг, урлал',
      'Parties' : 'Үдэшлэг',
      'Sports & Wellness' : 'Спорт',
      'Networking' : 'Хурал зөвлөгөөн',
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
    .state('guest', {
      url: '/guest',
      abstract: true,
      templateUrl: 'templates/guest/guestmenu.html',
      controller: 'guestCtrl'
    })
    .state('guest.home', {
      url: '/home',
      views: {
        'guestContent': {
          templateUrl: 'templates/guest/home.html',
          controller : 'guestHomeCtrl'
        }
      }
    })
    .state('guest.search', {
      url: '/search',
      views: {
        'guestContent': {
          templateUrl: 'templates/guest/guestsearch.html',
          controller : 'guestsearchCtrl'
        }
      }
    })
    .state('guest.category', {
      url: '/guestcategory/:categoryId',
      views: {
        'guestContent': {
          templateUrl: 'templates/guest/guestcategory.html',
          controller : 'guestcategoryCtrl'
        }
      }
    })
    .state('guest.detail', {
      url: '/guestdetail/:eventId',
      views: {
        'guestContent': {
          templateUrl: 'templates/guest/eventDetail.html',
          controller : 'guestDetailCtrl'
        }
      }
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
     .state('app.addevent', {
      url: '/addevent',
      views: {
        'menuContent': {
          templateUrl: 'templates/addEvent.html',
          controller : 'addEventCtrl'
        }
      }
    })
      .state('app.editevent', {
      url: '/myevent/:eventId/editevent',
      views: {
        'menuContent': {
          templateUrl: 'templates/editEvent.html',
          controller : 'editEventCtrl'
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
  $urlRouterProvider.otherwise(function($injector, $location){
    var $state = $injector.get("$state");
    $state.go('app.playlists');
  });
  // .otherwise('/app/playlists');
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