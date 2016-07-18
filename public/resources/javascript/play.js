define(['jquery', 'firebase'], function($, firebase) {
    var game = decodeURIComponent((new RegExp('[?|&]g=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null,
        spectate = decodeURIComponent((new RegExp('[?|&]spectate=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
    // grabbing URL Parameters;

    function fill(board) {
        $(".square").each(function() {
                $("#" + this.id + " > .word").html(board[this.id].word);
            })
            // Loops through every square and fills word;
    }
    firebase.database().ref('games/' + game).on("value", function(data) {
        if (!$("#redTeam").html().replace(/\s/g, "") && !$("#blueTeam").html().replace(/\s/g, "")) {
            for (player in data.val().players) { // Loops through the database to find members of the red team
                if (data.val().players[player].team == "red") {
                    $("#redTeam").append("<span>" + player + "</span><br/>")
                } else if (data.val().players[player].team == "blue") {
                    $("#blueTeam").append("<span>" + player + "</span><br/>")
                }
            }
            // fills teams;
        }
        fill(data.val().board);
    })
    if (spectate) {
        var spec = document.createElement("div");
        spec.id = "spectating";
        $(spec).html("SPECTATING")
        $("body").append(spec);
    }
    else {
            $(".word").click(function() {
              if(firebase.database().ref('games/'+game+'/turn').once('value') == firebase.database().ref('games/'+game+'/players/'+op.name+'/team').once('value')){
                        if (firebase.database().ref('games/'+game+'/turn').once('value') == "red"){
                            firebase.database().ref('games/'+game+'/turn').once('value').update("blue");
                        }
                        else{
                            firebase.database().ref('games/'+game+'/turn').once('value').update("red");
                        }
                var word = this;
                firebase.database().ref('games/' + game + "/board").once("value", function(board) {
                    $("#" + word.parentElement.id + " > .role").html(board.val()[word.parentElement.id].role);
                }).then(function() {
                    $("#" + word.parentElement.id + " > .role").css("transform", "rotateY(360deg)");
                    $(word).css("transform", "rotateY(180deg)");
                })
            )}}

        $(".word").click(function() {
<<<<<<< HEAD
                var word = this;
                $.ajax({
                    type: "GET",
                    url: "http://localhost:3000/turn",
                    success: function(a,b,c) {
                        console.log(a,b,c)
                        $("#" + word.parentElement.id + " > .role").css("transform", "rotateY(360deg)");
                        $(word).css("transform", "rotateY(180deg)");
                    }
                });
                $("#" + word.parentElement.id + " > .role").html(game.val().board[word.parentElement.id].role);
            })
            // Fills Role, and then flips, when corresponding word card is clicked;
=======
            firebase.database().ref('games/'+game+'/turn').once('value', function(){
                firebase.ref('games/'+game+'/players/'+op.name+'/team').once('teamName', function(){
                    if(teamName == value){

                }
                }))
            })
        })
>>>>>>> 2935a6e534f4e667da9074e553dd2e002c341e10
    }
        // Fills Role, and then flips, when corresponding word card is clicked;

})