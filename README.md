# golftalk-sample
Sample Application using using the new features of Firebase - This is NOT using AngularFire

- email loging and account creation
- simple data object database and retriveal in the database
- simple image object storage and retriveal in storage
- application uses [Image-Picker Plugin](http://bit.ly/25a3xfG) to select images to upload

### Setup Project

Install the plugin
```
cordova plugin add cordova-plugin-image-picker
```
Follow the instructions for installing ngCordova
[http://ngcordova.com/docs/install/](http://ngcordova.com/docs/install/)

I am using the `fetch` polyfill in the application, 

When you are all set up, the hed section in `index.html` file should look similar to this
```html
  <!-- ionic/angularjs js -->
  <script src="lib/ionic/js/ionic.bundle.js"></script>

  <script src="lib/ngCordova/dist/ng-cordova.js"></script>
  <!-- cordova script (this will be a 404 during development) -->
  <script src="cordova.js"></script>

  <script src="lib/whatwg-fetch/fetch.js"></script>
  
  <!-- your app's js -->
  <script src="js/app.js"></script>
  <script src="js/controllers.js"></script>
  <script src="js/services.js"></script>

  <script src="https://www.gstatic.com/firebasejs/live/3.0/firebase.js"></script>
```
