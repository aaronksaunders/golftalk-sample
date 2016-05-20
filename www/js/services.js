angular.module('starter.services', [])

  .factory('FirebaseDB', function () {
    var instance = null;
    var storageInstance = null

    return {
      initialize: function () {

        // Initialize Firebase
        var config = {
          apiKey: "AIzaSyDVgjc8ph0ZFGUV3YfN2J0OvfOz2xAWZug",
          authDomain: "newfirebaseapp.firebaseapp.com",
          databaseURL: "https://newfirebaseapp.firebaseio.com",
          storageBucket: "newfirebaseapp.appspot.com",
        };
        instance = firebase.initializeApp(config);
        storageInstance = firebase.storage();
      },
      database: function () {
        return instance.database()
      },
      storage: function () {
        return storageInstance
      }
    }
  })

  .factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [];

    return {
      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  });
