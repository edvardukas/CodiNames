define(['jquery', 'firebase'], function($, firebase) {

    window.op = {
        name: "testUser"
    },
    var finished = [];

    firebase.database().ref("games").on('child_removed', function(game) {
        $("#" + game.key).css({
            height: 0,
            margin: 0
        });
        setTimeout(function() {
            $("#" + game.key).remove()
        }, 300);
    });
    firebase.database().ref("games").on('value', function(data) {
        firebase.database().ref("users/" + op.name).once('value', function(data) {
            create(data.val());
        });
    });
    firebase.database().ref("users/" + op.name).on('value', function(data) {
        create(data.val());
    });

    function create(data) {
        data.games.filter(function(game, i) {
            firebase.database().ref("games/" + game).once('value', function(Gdata) {

                var gdata = Gdata.val(),
                    button = "JOIN",
                    gteam;
                if (gdata.players[op.name]) gteam = gdata.players[op.name].team || function() {
                    button = "SPECTATE";
                    return "red"
                }();
                else {
                    gteam = "red";
                    button = "SPECTATE";
                }
                if (!$("#" + game)[0]) {
                    var container = document.createElement("section"),
                        join = document.createElement("a"),
                        opponents = document.createElement("div"),
                        team = document.createElement("div");
                    join.className = "join";
                    opponents.className = "opp";
                    team.className = "team";
                    container.id = game;
                    join.href = "play.html?g=" + game;
                    $(join).html(button);
                    for (player in gdata.players) {
                        if (gdata.players[player].team == gteam) { // team check: IF SAME TEAM
                            $(team).append((($(team).html()) ? " • " : "") + player)
                        } else if (gdata.players[player].team == (gteam == "red" ? "blue" : "red")) { // team check: IF OPPOSING TEAM ( NO ELSE )
                            $(opponents).append((($(opponents).html()) ? " • " : "") + player)
                        }
                    }
                    $(container).append(team, opponents, join);
                    if (button === "SPECTATE") $(container).addClass("spectate");
                    if (gdata.isFinished) finished.push(container);
                    else $("#gamecontainer").append(container);
                } else {
                    $("#" + game + " > .opp, #" + game + " > .team ").html("");
                    $(join).html(button);
                    if (gdata.isFinished) {
                        $("#" + game).addClass("finished");
                        $("#" + game + "> .join").html("VIEW SCORES");
                    } else {
                        $("#" + game).removeClass("finished");
                        $("#" + game + "> .join").html(button);
                    }
                    for (player in gdata.players) {
                        if (gdata.players[player].team == gteam) { // team check: IF SAME TEAM
                            $("#" + game + " > .team ").append((($("#" + game + " > .team ").html()) ? " • " : "") + player)
                        } else if (gdata.players[player].team == (gteam == "red" ? "blue" : "red")) { // team check: IF OPPOSING TEAM ( NO ELSE )
                            $("#" + game + " > .opp ").append((($("#" + game + " > .opp ").html()) ? " • " : "") + player)
                        }
                    }
                }
            }).then(
                finished.filter(function(fgame) {
                    $("#gamecontainer").append(fgame);
                }));
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
        var players = {},
            games,
            key;
        $("[name=blue]").val().split(",").filter(function(each) {
            players[each] = {
                "team": "blue",
                "perm": "play"
            }
        });
        $("[name=red]").val().split(",").filter(function(each) {
            players[each] = {
                "team": "red",
                "perm": "play"
            }
        });
        firebase.database().ref("users/" + op.name + "/games").once("value", function(edata) {
            games = edata.val();
        })
        key = firebase.database().ref('games').push({
            "DOC": new Date(),
            "board": {
                "a1": {
                    "covered": false,
                    "role": "",
                    "word": ""
                },
                "a2": {
                    "covered": false,
                    "role": "",
                    "word": ""
                },
                "b1": {
                    "covered": false,
                    "role": "",
                    "word": ""
                },
                "b2": {
                    "covered": false,
                    "role": "",
                    "word": ""
                }
            },
            "creator": op.name,
            "isFinished": false,
            "players": players
        }).key;
        games.push(key);
        console.log(players)
        firebase.database().ref("users/" + op.name + "/games").set(games);
        $("[name=red],[name=blue]").val("");
    }
    $(".close, #cover").click(function() {
        closePop()
    })
    $("#creategame").click(function(event) {
        closePop();
        postData();
        event.preventDefault();
        return false;
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

    $("#slide").click(function() {
        if (parseInt($("#gcc").css("top")) === 70) {
            $("#gcc").css("top", -($("#gcc").height() - 120));
            $("#slide").css("transform", "rotate(180deg)")
        } else {
            $("#gcc").css("top", 70);
            $("#slide").css("transform", "rotate(0deg)")
        }
    })
});