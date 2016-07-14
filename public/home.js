function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
var op = {
    name: "testUser"
}
var test;

firebase.database().ref("users/" + op.name).on('value', function(data) {
    $("#usr").html(cap(data.val() ? data.val().Name : "guest"));
    create(data.val())
});

firebase.database().ref("users/" + op.name + "/games").on('child_removed', function(data) {
    $("#" + data.key).remove();
});

function create(data) {
    var finishedGames = [];
    data.games.filter(function(e, b) {
        firebase.database().ref("games/" + e).once('value', function(edata) {
        
            if (!$("#" + e)[0]) {
            var game = document.createElement("section"),
                    team = document.createElement("div"),
                    opponents = document.createElement("div"),
                    gamecode = document.createElement("div"),
                    join = document.createElement("a");
                $(team).html("Team: ");
                $(opponents).html("Opponents: ");
                for (name in edata.val().players) {
                    if (edata.val().players[name].team === edata.val().players[op.name].team) $(team).append((($(team).html() === "Team: ") ? "" : ", ") + name);
                    else $(opponents).append((($(opponents).html() === "Opponents: ") ? "" : ", ") + name);
                }
                game.id = e;
                team.className = "team";
                opponents.className = "opp";
                gamecode.className = "gamecode";
                join.className = "join ";
                join.innerHTML = "Join Game";
                join.href = "play.html?g=" + e;
                $(gamecode).html("Game Code: " + e);
                $(game).append(team, opponents, /* gamecode, */ join);
                if (edata.val().isFinished) {
                    $(game).addClass("finished");
                    $(join).html("Finished");
                    finishedGames.push(game);

                } else $("#gamecontainer").append(game);

            }if (b >= data.games.length - 1) {
                         finishedGames.filter(function(z) {
                             $("#gamecontainer").append(z)
                         })
                     }

        })

        /*
           if (!$("#" + gc)[0]) /* checks if game is already in list  {
               var game = document.createElement("section");
               var team = document.createElement("div");
               var opponents = document.createElement("div");
               var gamecode = document.createElement("div");
               var join = document.createElement("a");
               game.id = gc;
               team.className = "team";
               gamecode.className = "gamecode";
               join.className = "join ";
               join.innerHTML = "Join Game";
               join.href = "play.html?g=" + gc;
               $(team).html("Team: " + data.games[gc].team.join(", "));
               $(opponents).html("Opponents: " + data.games[gc].opp.join(", "));
               $(gamecode).html("Game Code: " + gc);
               $(game).append(team, opponents /* , gamecode  , join);
               $("#gamecontainer").append(game);
           } else {
               $("#" + gc + "> .team").html("Team: " + data.games[gc].team.join(", "));
               $("#" + gc + "> .opp").html("Team: " + data.games[gc].opp.join(", "));
               $("#" + gc + "> .gamecode").html("Game Code: " + gc);
               $("#" + gc + "> .join")[0].href = "play.html?g=" + gc;
           }
        */
    })
}

function Blur() {

    $("#cover").css({
        "opacity": 1,
        "z-index": 2
    });
};

function unBlur() {

    $("#cover").css({
        "opacity": 0
    });
    setTimeout(function() {
        $("#cover").css("z-index", 2)
    }, 300)
};
$("#new").click(function() {
    $("#setup").css({
        "opacity": 1,
        "z-index": 3,
        "top": 0
    });
    Blur()
})

function closePop() {
    $(".pop").css("top", "50px");
    isVisible = false;
    $(".pop, #cover").css({
        "opacity": 0,
    })
    setTimeout(function() {
        $(".pop, #cover").css({
            "z-index": -1,
        })
    }, 300)
}

function postData() {
    firebase.database().ref('games').push({
        "DOC": "DD/MM/YYYY",
        "board": {
            "a1": {
                "covered": false
            },
            "a2": {
                "covered": {
                    "role": "ROLE",
                    "word": "WORD"
                }
            },
            "b1": {
                "covered": false
            },
            "b2": {
                "covered": false
            }
        },
        "creator": "NAME OF GAME CREATOR",
        "isFinished": false,
        "players": {
            "blue": ["LIST OF PLAYERS", "ON THE BLUE TEAM"],
            "red": ["LIST OF PLAYERS ", "ON THE RED TEAM"]
        }
    })
}
$(".close, #cover").click(function() {
    closePop()
})
$("form").submit(function(event) {
    closePop();
    postData();
    event.preventDefault();
    return false
})

var isVisible = false;
$("#rulesButton").click(function() {
    if (isVisible == false) {
        $("#rules").css({
            "top": 0,
            "opacity": 1,
            "z-index": 3
        });
        isVisible = true;
        Blur();
    } else {
        closePop();
        isVisible = false;
    }
});
$("#hs").click(function(){
    $("#gamecontainer").css("height",0)
})