angular.module('starter.controllers', [])

  .controller('PhotosCtrl', function ($scope, $timeout, FirebaseDB) {

    /**
     * 
     */
    $scope.doAddPhoto = function () {

      fetch('img/adam.jpg').then(function (_data) {
        return _data.blob()
      }).then(function (_blob) {
        uploadTask = FirebaseDB.storage().ref('images/adam.jpg').put(_blob)

        uploadTask.on('state_changed', function (snapshot) {
          // Observe state change events such as progress, pause, and resume
        }, function (error) {
          // Handle unsuccessful uploads
          return error
        }, function () {
          // Handle successful uploads on complete..
          var downloadURL = uploadTask.snapshot.downloadURL;

          var ref = FirebaseDB.database().ref('Trash-Talk/images');
          ref.push({ imageURL: downloadURL, 'when': new Date() });

          return downloadURL
        });
      })
    }

    /**
     * 
     */
    function getFBPhotos(_selectedChat) {

      var ref = FirebaseDB.database().ref('Trash-Talk/images');
      ref.on("value", function (snapshot) {
        console.log(snapshot.val());
        var res = []
        snapshot.forEach(function (_item) {
          console.log(_item.val())
          res.push(_item.val())
        })
        $timeout(function () {
          $scope.images = res
        }, 1);
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    }

    // start here..
    getFBPhotos();
  })

  .controller('ChatsCtrl', function ($scope, $timeout, Chats, FirebaseDB) {
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
      var ref = FirebaseDB.database().ref('Trash-Talk/' + _selectedChat);
      ref.push({ 'player': 'fred', 'message': _data, 'when': new Date() });

    }

    function getFBChats(_selectedChat) {

      var _selectedChat = _selectedChat || 'saturday-chat'

      var ref = FirebaseDB.database().ref('Trash-Talk/' + _selectedChat);
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
