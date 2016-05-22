angular.module('starter.services', [])

  .factory('FirebaseDB', function ($q, $state, $timeout) {
    var instance, storageInstance, unsubscribe, currentUser = null
    var initialized = false

    return {
      initialize: function () {
        return $q(function (resolve, reject) {

          // if already initialized just let us know if there is a user or not
          if (initialized) {
            return !currentUser ? resolve(true) : resolve(false)
          }

          // Not initialized so... initialize Firebase
          var config = {
            apiKey: "AIzaSyCk6N39ZJkb-gM2EBTg2fSiwbvk9Lm0VUs",
            authDomain: "newfirebaseapp-2ee6f.firebaseapp.com",
            databaseURL: "https://newfirebaseapp-2ee6f.firebaseio.com",
            storageBucket: "newfirebaseapp-2ee6f.appspot.com",
          };

          // initialize database and storage
          instance = firebase.initializeApp(config);
          storageInstance = firebase.storage();

          // listen for authentication event, dont start app until I 
          // get either true or false
          $timeout(function () {
            unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
              currentUser = user
              console.log("got user..", currentUser);
              if (!initialized) {
                initialized = true;
                return !currentUser ? resolve(true) : resolve(false)
              }
            })
          }, 100);
        })
      },
      /**
       * return database instance
       */
      database: function () {
        return instance.database()
      },
      /**
      * return storage instance
      */
      storage: function () {
        return storageInstance
      },
      /**
       * return the currentUser object
       */
      currentUser: function () {
        return currentUser
      },

      /**
       * @param  {any} _credentials
       */
      login: function (_credentials) {
        return firebase.auth().signInWithEmailAndPassword(_credentials.email, _credentials.password).then(function (authData) {
          currentUser = authData
          return authData
        })
      },
      /**
       * @param  {any} _credentials
       */
      createUser: function (_credentials) {
        return firebase.auth().createUserWithEmailAndPassword(_credentials.email, _credentials.password).then(function (authData) {
          currentUser = authData
          return authData
        }).then(function (authData) {

          // add the user to a seperate list 
          var ref = instance.database().ref('Trash-Talk/users');
          return ref.child(authData.uid).set({
            "provider": authData.providerData[0],
            "avatar": (authData.profileImageURL || "missing"),
            "displayName": authData.email
          })

        })
      }
    }
  })

  .factory('Chats', function (FirebaseDB) {
    // Might use a resource here that returns a JSON array

    return {
      all: function () {
        return null;
      },
      remove: function (chat) {

      },
      /**
       * @param  {any} _selectedChat
       * @param  {any} _data
       */
      add: function (_selectedChat, _data) {
        var _selectedChat = _selectedChat || 'saturday-chat'
        var ref = FirebaseDB.database().ref('Trash-Talk/' + _selectedChat);
        return ref.push({
          'player': FirebaseDB.currentUser().displayName || FirebaseDB.currentUser().email,
          'message': _data,
          'when': new Date().getTime(),
          'player_uid': FirebaseDB.currentUser().uid,
        });
      },

      /**
       * @param  {any} _selectedChat
       * @param  {any} _handler
       */
      get: function (_selectedChat, _handler) {
        var _selectedChat = _selectedChat || 'saturday-chat'

        var ref = FirebaseDB.database().ref('Trash-Talk/' + _selectedChat);
        ref.on("value", function (snapshot) {
          console.log(snapshot.val());
          var res = []
          snapshot.forEach(function (_item) {
            res.push({ player: _item.val().player, message: _item.val().message })
          })

          // send updated data back to controller..
          _handler(res);

        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
      }
    };
  });
