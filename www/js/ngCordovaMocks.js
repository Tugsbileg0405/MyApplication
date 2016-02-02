angular.module('ngCordovaMocks', [])    
.factory('$cordovaNetwork', [function () {    
  return {    
    getNetwork: function () {
      return "Edge"
    },

    isOnline: function () {
      return true;
    },

    isOffline: function () {
      return false
    }
  }
}]);