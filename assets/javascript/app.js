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
var player1 = null;
var player2 = null;
var playerNum = 0;
var wins = 0;
var loses = 0;
var currentPlayer = "";


$("document").ready(function(){
  //clear database chatRoom on refresh
  database.ref().set({
    message: ""
  });

  function statusUpdate(){
    database.ref('/player/' + 1).set({
      playerName: player1,
      dataWins: wins,
      dataLoses: loses
    });
    database.ref('/player/' + 2).set({
      playerName: player2,
      dataWins: loses,
      dataLoses: wins
    });
    $("#win1").text(wins);
    $("#lose1").text(loses);
    $("#win2").text(loses);
    $("#lose2").text(wins);
  }
  //when the chatroom enterBtn is press it get a timestamp and the context of the input and store it in the firebase database
  $("#enterBtn").on("click", function(){
    // event.preventDefaut();
    var input = currentPlayer + " " + moment().format('h:mm:ss a') + ":  " + $("#inputBox").val().trim();

    $("#inputBox").val(""); //clear input box after it has been submitted

    database.ref().push({
      message: input
    });
    return false;
  });

  //setting playername in the firebase database
  $("#submtNameBtn").on("click",function(){
    if(currentPlayer===""){
      currentPlayer = $("#inputName").val().trim();
      $("#inputName").val("");

      if(player1===null){
        database.ref('/player/' + 1).set({
            playerName: currentPlayer,
            dataWins: loses,
            dataLoses: wins
        });
      } else if(player2===null){
        database.ref('/player/' + 2).set({
            playerName: currentPlayer,
            dataWins: wins,
            dataLoses: loses
        });
      } else{
        $("#battleStatus").text("To many players")
      }
    }
  });

  //once context is uploaded into firebase it shoots it into the chat box at the top
  database.ref().on("child_added", function(childsnapshot) {
    var dataMessage = childsnapshot.val().message;
    console.log("child added");

    if(childsnapshot.child("message").exists()){
      if(dataMessage.substring(0, dataMessage.indexOf(' '))===player1){
        $("#chatBox").prepend("<p class='player1Mes'>"+dataMessage+"</p>");
      } else {
        $("#chatBox").prepend("<p class='player2Mes'>"+dataMessage+"</p>");
      }
    }

    if(childsnapshot.child(1).exists()){
      player1 = childsnapshot.child(1).val().playerName;
      $("#player1Name").text(player1);
    }


  });


  database.ref().on("child_changed", function(changedchildsnapshot) {
    console.log("changed child");
    if(changedchildsnapshot.child(2).exists()){
      player2 = changedchildsnapshot.child(2).val().playerName;
      $("#player2Name").text(player2);
      $(".winLose").css('visibility', 'visible');
    }

    if(changedchildsnapshot.child(1).val().playerName===currentPlayer){
      $("#all1Btn").css('visibility', 'visible');
    }

    var choice1 = changedchildsnapshot.child(1).val().playerChoice;
    var choice2 = changedchildsnapshot.child(2).val().playerChoice;

    // console.log(changedchildsnapshot.child(1).val().playerChoice);
    if(choice1 !== undefined && choice2 === undefined){
      $("#all1Btn").css('visibility', 'hidden');
      if(changedchildsnapshot.child(2).val().playerName===currentPlayer){
        $("#all2Btn").css('visibility', 'visible');
      }

    } else if(choice2 !== undefined && choice1 === undefined){
      $("#all2Btn").css('visibility', 'hidden');

    } else if(choice1!==undefined&&choice2!==undefined){
      if((choice1==="rock"&&choice2==="scissor")||(choice1==="scissor"&&choice2==="paper")||(choice1==="paper"&&choice2==="rock")){
        $("#battleStatus").html("<h1>" + player1 + " is the WINNER!</h1><p class='battleP'>" + player1 + " chose " + choice1 + "</p><p class='battleP'>"+ player2 + " chose " + choice2);
        wins++;
        statusUpdate();
      } else if((choice2==="rock"&&choice1==="scissor")||(choice2==="scissor"&&choice1==="paper")||(choice2==="paper"&&choice1==="rock")){
        $("#battleStatus").html("<h1>" + player2 + " is the WINNER!</h1><p class='battleP'>" + player1 + " chose " + choice1 + "</p><p class='battleP'>"+ player2 + " chose " + choice2);
        loses++;
        statusUpdate();
      } else {
        $("#battleStatus").html("<h1>IT'S A TIE!</h1><p class='battleP'>" + player1 + " chose " + choice1 + "</p><p class='battleP'>"+ player2 + " chose " + choice2);
        statusUpdate();
      }
    } 

  });

  $(".btn1").on("click", function(){
    var player1Choice = $(this).data('value');
    $("#battleStatus").html(player1 + " has chosen!");
    database.ref('/player/' + 1).set({
      playerChoice: player1Choice,
      playerName: player1,
      dataWins: wins,
      dataLoses: loses
    });
  });

  $(".btn2").on("click", function(){
    var player2Choice = $(this).data('value');
    database.ref('/player/' + 2).set({
      playerChoice: player2Choice,
      playerName: player2,
      dataWins: wins,
      dataLoses: loses
    });
  });



});