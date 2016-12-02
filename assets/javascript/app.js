  var config = {
    apiKey: "AIzaSyA9IHRLhqM8poTc6Z9gNgYBkzls2Kv8ago",
    authDomain: "rps-multiplayer-dc43c.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-dc43c.firebaseio.com",
    storageBucket: "rps-multiplayer-dc43c.appspot.com",
    messagingSenderId: "1098249897558"
  };
  firebase.initializeApp(config);

  var database = firebase.database();


$("document").ready(function(){

    database.ref().set({
      message: "hello"
    });

});