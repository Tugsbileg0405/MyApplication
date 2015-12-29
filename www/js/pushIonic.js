          var io = Ionic.io();
    var push = new Ionic.Push({
      "onNotification": function(notification) {
        $state.go('app.playlists', {}, {reload:true});
      },
       "pluginConfig": {
          "ios": {
            "badge": true,
            "sound": true
           },
           "android": {
           "icon":"icon"             
           }
       } 
    });
    var user = Ionic.User.current();
    if (!user.id) {
      user.id = Ionic.User.anonymousId();
    }
    var callback = function(data) {
      push.addTokenToUser(user);
      user.save();
      if($localStorage.userdata){
      user.set('name', $localStorage.userdata.user.fullname);
      user.save();
      myData.getpushtoken(data.token).success(function (response){
          if(!response[0]){
                  var pushdata = {};
                  pushdata.user = $localStorage.userdata.user.person.id;
                  pushdata.token = data.token;
                  myData.pushtoken(pushdata).success(function (result){
                    console.log(result);
                  })
          }
          else {
            console.log('baina');
          }
      })
    }
    };
    push.register(callback);
