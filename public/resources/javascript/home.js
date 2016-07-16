define(['jquery', 'firebase'], function($, firebase) {

    function cap(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    var op = {
        name: "testUser"
    }

    var test;

    firebase.database().ref("games").on('child_removed', function(game) {
        $("#" + game.key).css("height", 0);
        setTimeout(function() {
            $("#" + game.key).remove()
        }, 300);
    });

    firebase.database().ref("users/" + op.name).on('value', function(data) {
        $("#usr").html(cap(data.val() ? data.val().Name : "guest"));
        create(data.val())
    });

    function create(data) {
        data.games.filter(function(game) {
            firebase.database().ref("games/" + game).once('value', function(Gdata) {

                var gdata = Gdata.val();
                if (!$("#" + game)[0]) {
                    var gteam,
                        container = document.createElement("section"),
                        join = document.createElement("a"),
                        opponents = document.createElement("div"),
                        team = document.createElement("div");
                    join.className = "join";
                    opponents.className = "opp";
                    team.className = "team";
                    container.id = game;
                    join.href = "play.html?g=" + game;
                    $(join).html("Join")
                    if (gdata.players[op.name]) gteam = gdata.players[op.name].team || function() {
                        $(join).html("spectate");
                        return "red"
                    }();
                    else {
                        gteam = "red";
                        $(join).html("spectate")
                    }
                    for (player in gdata.players) {
                        if (gdata.players[player].team == gteam) { // team check: IF SAME TEAM
                            $(team).append((($(team).html()) ? " • " : "") + player)
                        } else if (gdata.players[player].team == (gteam == "red" ? "blue" : "red")) { // team check: IF OPPOING TEAM ( NO ELSE )
                            $(opponents).append((($(opponents).html()) ? " • " : "") + player)
                        }
                    }
                    $(container).append(team, opponents, join);
                    $("#gamecontainer").append(container);
                } else {
                    for (player in gdata.players) {
                        if (gdata.players[player].team == gteam) { // team check: IF SAME TEAM
                            $("#" + game + " > .team ").append((($("#" + game + " > .team ").html()) ? " • " : "") + player)
                        } else if (gdata.players[player].team == (gteam == "red" ? "blue" : "red")) { // team check: IF OPPOING TEAM ( NO ELSE )
                            $("#" + game + " > .opp ").append((($("#" + game + " > .opp ").html()) ? " • " : "") + player)
                        }
                    }
                }
            });
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
                    "role": "ROLE",
                    "word": "WORD"
                },
                "a2": {
                    "covered": false,
                    "role": "ROLE",
                    "word": "WORD"
                },
                "b1": {
                    "covered": false,
                    "role": "ROLE",
                    "word": "WORD"
                },
                "b2": {
                    "covered": false,
                    "role": "ROLE",
                    "word": "WORD"
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
            $("#gcc").css("top", -($("#gcc").height() - 50));
            $("#slide").css("transform", "rotate(180deg)")
        } else {
            $("#gcc").css("top", 70);
            $("#slide").css("transform", "rotate(0deg)")
        }
    })
});