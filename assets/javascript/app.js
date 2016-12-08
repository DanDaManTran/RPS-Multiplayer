//initaializing firebase
var config = {
  apiKey: "AIzaSyA9IHRLhqM8poTc6Z9gNgYBkzls2Kv8ago",
  authDomain: "rps-multiplayer-dc43c.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-dc43c.firebaseio.com",
  storageBucket: "rps-multiplayer-dc43c.appspot.com",
  messagingSenderId: "1098249897558"
};
firebase.initializeApp(config);
var database = firebase.database();
var players = database.ref('/players');
var player1 = null;
var player2 = null;
var playerNum = 0;
var wins = 0;
var loses = 0;


$("document").ready(function(){
  //clear database chatRoom on refresh
  database.ref().set({
    message: ""
  });



  //when the chatroom enterBtn is press it get a timestamp and the context of the input and store it in the firebase database
  $("#enterBtn").on("click", function(){

    var input = moment().format('h:mm:ss a') + ":  " + $("#inputBox").val().trim();

    $("#inputBox").val(""); //clear input box after it has been submitted

    database.ref().push({
      message: input
    });

    return false;
  });

  //setting playername in the firebase database
  $("#submtNameBtn").on("click",function(){
    var inputName = $("#inputName").val().trim();
    $("#inputName").val("");

    if(player1===null){
      playerNum = 1;
      database.ref('/player/' + playerNum).set({
          playerName: inputName,
          dataWins: 0,
          dataLoses: 0
      });
      // player1 = playerNum;
    } else if(player2===null){
      playerNum = 2;
      database.ref('/player/' + playerNum).set({
          playerName: inputName,
          dataWins: 0,
          dataLoses: 0
      });
      // player2 = playerNum;
    } else{
      $("#battleStatus").text("To many players")
    }
  });

  //once context is uploaded into firebase it shoots it into the chat box at the top
  database.ref().on("child_added", function(childsnapshot) {
    var dataMessage = childsnapshot.val().message;

    if(childsnapshot.child("message").exists()){
      $("#chatBox").prepend("<p>"+dataMessage+"</p>");
    }

    if(childsnapshot.child(1).exists()){
      console.log(childsnapshot.child(1).playerName);
    } else if(childsnapshot.child(2).exists()){
      player2 = "name";
    }
  });


  database.ref().on("value", function(snapshot) {
  
    if(snapshot.child(1).exists()){
      console.log("Hello");
    }
    // if(snapshot.child(1).exists()){
    //   player1 = "something";
    //   console.log(player1);
    //   console.log(player2);
    // } else if(snapshot.child(2).exists()){
    //   player2 = "something2";
    //   console.log(player1);
    //   console.log(player2);
    // }


    }, function(errorObject) {
       console.log("The read failed: " + errorObject.code);
  });



});