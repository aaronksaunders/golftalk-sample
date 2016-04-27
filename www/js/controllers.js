angular.module('starter.controllers', [])
  .value("FIREBASE_CONFIG", {
    BASE_URL: 'https://clearlyinnovative-firebasestarterapp.firebaseio.com/'
  })

  .controller('DashCtrl', function ($scope) {

  })

  .controller('ChatsCtrl', function ($scope, $timeout, FIREBASE_CONFIG, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    //$scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };


    $scope.inputtext = ""

    /**
     * called when the users clicks submit to add a new message
     * 
     * @param _data {String} text entered for the message
     */
    $scope.addMessage = function (_data, _selectedChat) {
      var _selectedChat = _selectedChat || 'saturday-chat'
      var baseRef = new Firebase(FIREBASE_CONFIG.BASE_URL);
      var ref = baseRef.child('Trash-Talk/' + _selectedChat);
      ref.push({ 'player': 'fred', 'message': _data, 'when': new Date() });
    }

    function getFBChats(_selectedChat) {

      var _selectedChat = _selectedChat || 'saturday-chat'

      var baseRef = new Firebase(FIREBASE_CONFIG.BASE_URL);
      var ref = baseRef.child('Trash-Talk/' + _selectedChat);
      ref.on("value", function (snapshot) {
        console.log(snapshot.val());
        var res = []
        snapshot.forEach(function (_item) {
          res.push({ player: _item.val().player, message: _item.val().message })
        })
        $timeout(function () {
          $scope.chats = res
        }, 1);
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    }

    // start here..
    getFBChats();
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);

  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
