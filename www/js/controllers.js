angular.module('starter.controllers', [])

  .controller('PhotosCtrl', function ($scope, $timeout, FirebaseDB, $cordovaImagePicker, $ionicPopup) {

    function pickTheImage() {
      var options = {
        maximumImagesCount: 1,
        width: 320,
        quality: 80
      };

      return $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
          }
          return results[0];

        }, function (error) {
          // error getting photos
        });
    }

    /**
     * @param  {any} _image
     * @param  {any} _title
     */
    function processImage(_image, _title) {

      return fetch(_image).then(function (_data) {
        return _data.blob()
      }).then(function (_blob) {
        uploadTask = FirebaseDB.storage().ref('images/' + _title + '.jpg').put(_blob)

        uploadTask.on('state_changed', function (snapshot) {
          // Observe state change events such as progress, pause, and resume
        }, function (error) {
          // Handle unsuccessful uploads
          return error
        }, function () {
          // Handle successful uploads on complete..
          var downloadURL = uploadTask.snapshot.downloadURL;

          // save a reference to the image for listing purposes
          var ref = FirebaseDB.database().ref('Trash-Talk/images');
          ref.push({ imageURL: downloadURL, 'when': new Date() });

          return downloadURL
        });
      })
    }
    /**
     * @param  {any} _title
     */
    $scope.doAddPhoto = function () {
      pickTheImage().then(function (_image) {

        $timeout(function () {
          return $ionicPopup.prompt({
            title: 'Please enter title for the image'
          }).then(function (_title) {
            return processImage(_image, _title)
          });
        }, 1);

      })
    }

    /**
     * @param  {String} _selectedChat
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
