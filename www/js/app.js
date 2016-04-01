// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ion-affix','ionicProcessSpinner','ngIOS9UIWebViewPatch','ti-segmented-control','ngResource','ngCordovaOauth','ionic-native-transitions','angular-cache','ImgCache','starter.gesture','ionic.service.core','pascalprecht.translate','ionic.contrib.drawer','angular.filter','starter.controllers','ja.qr','starter.services','starter.auth','ui.router','ionic-material','ngStorage','ngCordova'])
.run(function($ionicPlatform,$location,$cordovaPush,EventService,ImgCache,$ionicLoading,myData,$rootScope,AuthService,$localStorage,$location,$localStorage,$state) {
 document.addEventListener("deviceready", function(){
     navigator.splashscreen.hide();
    ImgCache.init(function(){
        console.log('cache created successfully!');
    }, function(){
        console.log('check the log for errors');
    });
}, false);
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
      console.log("Registration error: " + err);
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
$rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState, fromStateParams) {
  if(toState.name.indexOf('app') !== -1 ) {
    if(!AuthService.getAuthStatus()) {
      event.preventDefault();
      $state.go('main',{},{reload:true});
    }
  }
})

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
      }
    }
  });



})


.config(function($stateProvider,$ionicNativeTransitionsProvider,CacheFactoryProvider,ImgCacheProvider,$rootScopeProvider,$translateProvider,$httpProvider,$ionicConfigProvider ,$urlRouterProvider) {
     ImgCacheProvider.setOption('debug', false);
     ImgCacheProvider.setOption('usePersistentCache', true);
     ImgCacheProvider.setOptions({
      debug: false,
      usePersistentCache: true
    });
     ImgCacheProvider.manualInit = true;

     angular.extend(CacheFactoryProvider.defaults, { maxAge: 15 * 60 * 1000 });

     $ionicNativeTransitionsProvider.setDefaultOptions({
      duration: 200, 
      slowdownfactor: 4, 
      iosdelay: -1, 
      androiddelay: -1, 
      winphonedelay: -1, 
      fixedPixelsTop: 0, 
      fixedPixelsBottom: 0,
      triggerTransitionEvent: '$ionicView.afterEnter', 
      backInOppositeDirection: false 
    });
     $ionicNativeTransitionsProvider.setDefaultTransition({
      type: 'slide',
      direction: 'left'
    });
     $ionicNativeTransitionsProvider.setDefaultBackTransition({
      type: 'slide',
      direction: 'right'
    });

    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.cache = false;
    $rootScopeProvider.digestTtl(10);
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $ionicConfigProvider.views.maxCache(10);
    $ionicConfigProvider.views.swipeBackEnabled(false);
    $ionicConfigProvider.form.checkbox('square');
    $ionicConfigProvider.views.forwardCache(true);
    $ionicConfigProvider.backButton.text('...');
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
       params: {data:null},
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
          templateUrl: 'templates/events.html',
          controller: 'EventsCtrl'
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
       .state('app.urilgaImg', {
      url: '/invitation/:urilgaId/img',
      views: {
        'menuContent': {
          templateUrl: 'templates/urilgaImg.html',
          controller : 'urilgaImgCtrl'
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
     .state('app.ticketrequest', {
      url: '/playlists/:eventId/ticketrequest',
      views: {
        'menuContent': {
          templateUrl: 'templates/ticket-request.html',
          controller: 'ticketrequestCtrl'
        }
      }
    })
     .state('app.registration', {
      url: '/playlists/:eventId/registration',
      views: {
        'menuContent': {
          templateUrl: 'templates/registration.html',
          controller: 'registrationCtrl'
        }
      }
    })
    .state('app.single', {
      url: '/playlists/:playlistId',
      params: {data:null},
      views: {
        'menuContent': {
          templateUrl: 'templates/event-detail.html',
          controller: 'eventDetailCtrl'
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
.directive('searchBar', [function () {
  return {
    scope: {
      ngModel: '='
    },
    require: ['^ionNavBar', '?ngModel'],
    restrict: 'E',
    replace: true,
    template: '<ion-nav-buttons side="right">'+
            '<div class="searchBar">'+
              '<div class="searchTxt" ng-show="ngModel.show">'+
                  '<div class="bgdiv"></div>'+
                  '<div class="bgtxt">'+
                    '<input type="text" placeholder="Procurar..." ng-model="ngModel.txt">'+
                  '</div>'+
                '</div>'+
                '<i class="icon placeholder-icon" ng-click="ngModel.txt=\'\';ngModel.show=!ngModel.show"></i>'+
            '</div>'+
          '</ion-nav-buttons>',
    
    compile: function (element, attrs) {
      var icon=attrs.icon
          || (ionic.Platform.isAndroid() && 'ion-android-search')
          || (ionic.Platform.isIOS()     && 'ion-ios7-search')
          || 'ion-search';
      angular.element(element[0].querySelector('.icon')).addClass(icon);
      
      return function($scope, $element, $attrs, ctrls) {
        var navBarCtrl = ctrls[0];
        $scope.navElement = $attrs.side === 'right' ? navBarCtrl.rightButtonsElement : navBarCtrl.leftButtonsElement;
        
      };
    },
    controller: ['$scope','$ionicNavBarDelegate', function($scope,$ionicNavBarDelegate){
      var title, definedClass;
      $scope.$watch('ngModel.show', function(showing, oldVal, scope) {
        if(showing!==oldVal) {
          if(showing) {
            if(!definedClass) {
              var numicons=$scope.navElement.children().length;
              angular.element($scope.navElement[0].querySelector('.searchBar')).addClass('numicons'+numicons);
            }
            
            title = $ionicNavBarDelegate.getTitle();
            $ionicNavBarDelegate.setTitle('');
          } else {
            $ionicNavBarDelegate.setTitle(title);
          }
        } else if (!title) {
          title = $ionicNavBarDelegate.getTitle();
        }
      });
    }]
  };
}])
;