define(['jquery', 'firebase'], function($, firebase) {
    var game = decodeURIComponent((new RegExp('[?|&]g=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null,
        spectate = decodeURIComponent((new RegExp('[?|&]spectate=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null,
        boardSqaures = ["a1", "a2", "b1", "b2"];
    // grabbing URL Parameters;

    function fill(board) {
        $(".square").each(function() {
            $("#" + this.id + " > .word").html(board[this.id].word);
        })
        // Loops through every square and fills word;
    }
    function fillTeams(player,gameData) {
        console.log(player,gameData.val())
        if (gameData.val().players[player].team == "red") {
            firebase.database().ref("users/"+player).once("value",function(UID){
                $("#redTeam").append("<span>" + UID.val().name + "</span><br/>")
            })
        } else if (gameData.val().players[player].team == "blue") {
            firebase.database().ref("users/"+player).once("value",function(UID){
                $("#blueTeam").append("<span>" + UID.val().name + "</span><br/>")
            })
        }
    }
    firebase.database().ref("games/" + game + "/board").once("value", function (board) {
        for (square in board.val()) {
            if (board.val()[square].covered) {
                $("#" + square + " > .role").addClass(board.val()[square].role).css("transform", "rotateY(360deg)");
                $("#" + square + " > .word").css("transform", "rotateY(180deg)");
            }
        }
    });
    firebase.database().ref("games/" + game + "/board").on("child_changed", function (square) {
        if (square.val().covered) {
            $("#" + square.key + " > .role").addClass(square.val().role).css("transform", "rotateY(360deg)");
            $("#" + square.key + " > .word").css("transform", "rotateY(180deg)");
        }
    });
    firebase.database().ref('games/' + game).on("value", function(gameD) {
            console.log(gameD.val())
        if (!$("#redTeam").html().replace(/\s/g, "") && !$("#blueTeam").html().replace(/\s/g, "")) { // checks if filled
            for (player in gameD.val().players) {
                fillTeams(player,gameD)
            }
        }
        fill(gameD.val().board);

        // TODO: RECKTIFY THIS NESTING;

        firebase.auth().onAuthStateChanged(function(User) {
        if (player = gameD.val().players[User.uid]) {
            if (player.perm == "master") {
                var view = document.createElement("div"),
                    squares = [];
                for (var i = 0; i < 4; ++i) {
                    squares[i] = document.createElement("div");
                    squares[i].id = "v" + boardSqaures[i];
                    $(squares[i]).addClass(gameD.val().board[boardSqaures[i]].role);
                }
                squares.filter(function(square) {
                    $(view).append(square);
                })
                view.id = "masterv";
                $("body").append(view);
                $("#board").css("bottom", "300px");
            } else {
                    $(".word").click(function () {
                        var word = this;
                        $.ajax({
                            type: "POST",
                            url: "http://localhost:3000/turn",
                            data: {
                                game: game,
                                square: word.parentElement.id,
                                name: User.uid
                            }
                        });
                    })
                    // Fills Role, and then flips, when corresponding word card is clicked;

            }
            }
        })
    })
})