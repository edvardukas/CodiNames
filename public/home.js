function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
var op = {
    name: "testUser"
}
var test;

firebase.database().ref("users/" + op.name).on('value', function(data) {
    var username = data.val() ? data.val().Name : "guest";
    $("#usr").html(cap(username));
    create(data.val());
});

firebase.database().ref("users/" + op.name + "/games").on('child_removed', function(data) {
    $("#" + data.key).remove();
});

function create(data) {
    for (gc in data.games) {
        if (!$("#" + gc)[0]) /* checks if game is already in list */ {
            var game = document.createElement("section");
            var team = document.createElement("div");
            var opponents = document.createElement("div");
            var gamecode = document.createElement("div");
            var join = document.createElement("a");
            game.id = gc;
            team.className = "team";
            opponents.className = "opp";
            gamecode.className = "gamecode";
            join.className = "join ";
            join.innerHTML = "Join Game";
            join.href = "play.html?g=" + gc;
            $(team).html("Team: " + data.games[gc].team.join(", "));
            $(opponents).html("Opponents: " + data.games[gc].opp.join(", "));
            $(gamecode).html("Game Code: " + gc);
            $(game).append(team, opponents /* , gamecode */ , join);
            $("#gamecontainer").append(game);
        } else {
            $("#" + gc + "> .team").html("Team: " + data.games[gc].team.join(", "));
            $("#" + gc + "> .opp").html("Team: " + data.games[gc].opp.join(", "));
            $("#" + gc + "> .gamecode").html("Game Code: " + gc);
            $("#" + gc + "> .join")[0].href = "play.html?g=" + gc;
        }
    }
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