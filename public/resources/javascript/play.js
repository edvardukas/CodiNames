define(['jquery', 'firebase'], function($, firebase) {
    var game = decodeURIComponent((new RegExp('[?|&]g=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null,
        spectate = decodeURIComponent((new RegExp('[?|&]spectate=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null,
        boardSqaures = ["a1","a2","b1","b2"];
    // grabbing URL Parameters;

    function fill(board) {
        $(".square").each(function() {
            $("#" + this.id + " > .word").html(board[this.id].word);
        })
        // Loops through every square and fills word;
    }

    firebase.database().ref('games/' + game).on("value", function(game) {
        if (!$("#redTeam").html().replace(/\s/g, "") && !$("#blueTeam").html().replace(/\s/g, "")) { // checks if filled
            for (player in game.val().players) { // Loops through the database to find members of the red team
                if (game.val().players[player].team == "red") {
                    $("#redTeam").append("<span>" + player + "</span><br/>")
                } else if (game.val().players[player].team == "blue") {
                    $("#blueTeam").append("<span>" + player + "</span><br/>")
                }
            }
            // fills teams;
        }
        fill(game.val().board);

        // TODO: RECKTIFY THIS NESTING;

        if (player = game.val().players[op.name]) {
            if (player.perm == "master") {
                var view = document.createElement("div"),
                    squares = [];
                for (var i = 0; i < 4; ++i) {
                    squares[i]=document.createElement("div");
                    squares[i].id = "v"+boardSqaures[i];
                    $(squares[i]).addClass(game.val().board[boardSqaures[i]].role);
                }
                squares.filter(function(square){
                    $(view).append(square);
                })
                view.id = "masterv";
                $("body").append(view);
                $("#board").css("bottom","300px");
            } else {
                $(".word").click(function() {
                    var word = this;
                    $.ajax({
                        type: "POST",
                        url: "http://localhost:3000/turn",
                        data: {
                            game: game,
                            square: word.parentElement.id,
                            name: op.name
                        },
                        success: function(a, b, c) {
                            $("#" + word.parentElement.id + " > .role").html(c.responseText).css("transform", "rotateY(360deg)")
                            console.log(a, b, c);
                            $(word).css("transform", "rotateY(180deg)");
                        }
                    });
                })
                // Fills Role, and then flips, when corresponding word card is clicked;
            }
        } else {
            var spec = document.createElement("div");
            spec.id = "spectating";
            $(spec).html("SPECTATING")
            $("body").append(spec);
        }
    })
})