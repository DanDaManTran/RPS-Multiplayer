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

  //when someone leave, it set database with dis
  database.ref().onDisconnect().set({
    dis: ""
  });

  //status update function. Used to update the score and the database
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
    $("#winLose1").text("Wins: " + wins + " " + "Loses: "+ loses);
    $("#winLose2").text("Wins: " + loses + " " + "Loses: "+ wins);
  }

  //when the chatroom enterBtn is press it get a timestamp and the context of the input and store it in the firebase database
  $("#enterBtn").on("click", function(){

    // event.preventDefaut();
    var input = currentPlayer + " " + moment().format('h:mm:ss a') + ":  " + $("#inputBox").val().trim();
   
    //clear input box after it has been submitted
    $("#inputBox").val(""); 
   
    //used to push messages to the database
    database.ref().push({
      message: input
    });
    return false;
  });

  //setting playername in the firebase database
  $("#submtNameBtn").on("click",function(){

    //currentplayer will keep track of you the user is in each page
    if(currentPlayer===""){
      currentPlayer = $("#inputName").val().trim();
      $("#inputName").val("");

      //if none have entered their name it trigger the first condition and it goes on until player 1 and 2 is filled
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

  //this is player 1 buttons
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

  //this is player 2 buttons
  $(".btn2").on("click", function(){
    var player2Choice = $(this).data('value');
    database.ref('/player/' + 2).set({
      playerChoice: player2Choice,
      playerName: player2,
      dataWins: wins,
      dataLoses: loses
    });
  });

  //listening for a value change in the database. Mainly used for someone disconnecting 
  database.ref().on("value", function(snapshot){
    if(snapshot.child("dis").exists()){
      $("#battleStatus").text("YOUR ENEMY HAVE FLED!!")
      player1 = null;
      player2 = null;
      playerNum = 0;
      wins = 0;
      loses = 0;
      currentPlayer = "";
      $("#player1Name").text("Waiting");
      $("#player2Name").text("Waiting");
      $("#all1Btn").css('visibility', 'hidden');
      $("#all2Btn").css('visibility', 'hidden');
      $("#winLose1").css('visibility', 'hidden');
      $("#winLose2").css('visibility', 'hidden');
    }
  });

  //listening for a child being added. using it for the player1 name input and the messanger
  database.ref().on("child_added", function(childsnapshot) {
    var dataMessage = childsnapshot.val().message;
    //if there is a new message it will upload it to the chatbox
    if(childsnapshot.child("message").exists()){
      if(dataMessage.substring(0, dataMessage.indexOf(' '))===player1){
        $("#chatBox").prepend("<p class='player1Mes'>"+dataMessage+"</p>");
      } else {
        $("#chatBox").prepend("<p class='player2Mes'>"+dataMessage+"</p>");
      }
    }

    //if player 1 has an input it will update the screen
    if(childsnapshot.child(1).exists()){
      player1 = childsnapshot.child(1).val().playerName;
      $("#battleStatus").text(player1 + " is approaching!");
      if(player1===currentPlayer){
        $("#player1Name").text("You are " + player1);
      } else {
        $("#player1Name").text("Your enemy is " + player1);
      }
    }
  });

  //listening for a change in child. lots of stuff in here 
  database.ref().on("child_changed", function(changedchildsnapshot) {

    //if function to see if there is a update in player 2 name, and it will update accordingly. it will show the score which starts at 0-0
    if(changedchildsnapshot.child(2).exists()){
      player2 = changedchildsnapshot.child(2).val().playerName;
      if(player2===currentPlayer){
        $("#player2Name").text("You are " + player2);
      } else {
        $("#player2Name").text("Your enemy is " + player2);
      }
      $("#winLose1").css('visibility', 'visible');
      $("#winLose2").css('visibility', 'visible');
    }

    //it is going to wait for a child change in players "player 2 name input". It will show player 1 buttons for RPS
    if(changedchildsnapshot.child(1).val().playerName===currentPlayer){
      $("#all1Btn").css('visibility', 'visible');
    }

    //a short cut for players choices 
    var choice1 = changedchildsnapshot.child(1).val().playerChoice;
    var choice2 = changedchildsnapshot.child(2).val().playerChoice;

    //it going to activate when player 1 chooses and button. then it will hide player 1 choice and let player 2 choose and vis versa. Once both choices are in then it will calculate who wins and update the database/scoreboard/ and annouce the winner in the battle grounds
    if(choice1 !== undefined && choice2 === undefined){
      $("#all1Btn").css('visibility', 'hidden');
      $("#battleStatus").html(player1 + " has chosen!");
      if(changedchildsnapshot.child(2).val().playerName===currentPlayer){
        $("#all2Btn").css('visibility', 'visible');
      }
    } else if(choice2 !== undefined && choice1 === undefined){
      $("#all2Btn").css('visibility', 'hidden');
    } else if(choice1!==undefined&&choice2!==undefined){
      if((choice1==="rock"&&choice2==="scissor")||(choice1==="scissor"&&choice2==="paper")||(choice1==="paper"&&choice2==="rock")){
        wins++;
        statusUpdate();
        $("#battleStatus").html("<h1>" + player1 + " is the WINNER!</h1><p class='battleP'>" + player1 + " chose " + choice1 + "</p><p class='battleP'>"+ player2 + " chose " + choice2 + "<p>Waiting for " + player1 + "</p>");
      } else if((choice2==="rock"&&choice1==="scissor")||(choice2==="scissor"&&choice1==="paper")||(choice2==="paper"&&choice1==="rock")){
        loses++;
        statusUpdate();
        $("#battleStatus").html("<h1>" + player2 + " is the WINNER!</h1><p class='battleP'>" + player1 + " chose " + choice1 + "</p><p class='battleP'>"+ player2 + " chose " + choice2 + "<p>Waiting for " + player1 + "</p>");
      } else {
        statusUpdate();
        $("#battleStatus").html("<h1>IT'S A TIE!</h1><p class='battleP'>" + player1 + " chose " + choice1 + "</p><p class='battleP'>"+ player2 + " chose " + choice2 + "<p>Waiting for " + player1 + "</p>");
      }
    } 
  });
});