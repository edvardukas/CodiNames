define(['jquery', 'firebase'], function($, firebase) {
    var game = decodeURIComponent((new RegExp('[?|&]g=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
    window.op = {
        name: "testUser"
    };
    firebase.database().ref('games/' + game).on("value", function(data) {
        if (!$("#redTeam").html().replace(/\s/g,"") && !$("#blueTeam").html().replace(/\s/g,"")) {
            for (player in data.val().players) { // Loops through the database to find members of the red team
                if (data.val().players[player].team == "red") {
                    $("#redTeam").append("<span>" + player + "</span><br/>")
                } else if (data.val().players[player].team == "blue") {
                    $("#blueTeam").append("<span>" + player + "</span><br/>")
                }
            }
        }
        fill(data.val().board);
    })

    function fill(board) {
        $(".square").each(function() {
            $("#" + this.id + " > .word").html(board[this.id].word);
        })
    }

    $(".word").click(function(){
        if(firebase.database().ref('games/'+game+'/turn').once('value') == firebase.database().ref('games/'+game+'/players/'+op.name+'/team').once('value')){
            if (firebase.database().ref('games/'+game+'/turn').once('value') == "red"){
                firebase.database().ref('games/'+game+'/turn').once('value').update("blue");
            }
            else{
                firebase.database().ref('games/'+game+'/turn').once('value').update("red");
            }
            var word = this;
            firebase.database().ref('games/' + game +"/board").once("value", function(board) {
                $("#" + word.parentElement.id + " > .role").html(board.val()[word.parentElement.id].role);
            }).then(function(){
                $("#" + word.parentElement.id + " > .role").css("transform","rotateY(360deg)");
                $(word).css("transform","rotateY(180deg)");
            })
        }
    })
})