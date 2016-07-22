define(['jquery', 'firebase'], function($, firebase) {
    var finished = [],
        User;
    function populate(player,gameData,team,opponents){
        console.log("populating: "+ player,team );
        firebase.database().ref("users/" + player).once("value", function(UID) {
            console.log(player,UID.val());
            if (gameData.players[player].team == team) { // team check: IF SAME TEAM
                $(team).append((($(team).html()) ? " • " : "") + UID.val().name);
            } else if (gameData.players[player].team == (team == "red" ? "blue" : "red")) { // team check: IF OPPOSING TEAM ( NO ELSE )
                $(opponents).append((($(opponents).html()) ? " • " : "") + UID.val().name);
            }
        })
    }
    firebase.auth().onAuthStateChanged(function(user) {
        if (User) $("#gamecontainer").html("");
        else $("#gamecontainer").html('<div id="new">New Game</div><br/>');
        User = firebase.auth().currentUser;
        firebase.database().ref("users/" + User.uid).once('value', function(data) {
            User.name = data.val().name || "guest";
        })
        firebase.database().ref("games").on('child_removed', function(game) {
            $("#" + game.key).css({
                height: 0,
                margin: 0
            });
            setTimeout(function() {
                $("#" + game.key).remove()
            }, 300);
        });
        firebase.database().ref("users/" + User.uid).on('value', function(data) {
            create(data.val());
        });

        function create(data) {
            data.games.forEach(function(game, i) {
                firebase.database().ref("games/" + game).once('value', function(Gdata) {

                    var gdata = Gdata.val(),
                        button = "JOIN",
                        gteam;
                    if (gdata.players[User.uid]) gteam = gdata.players[User.uid].team || function() {
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
                        // gdata.players.forEach(function (player) {
                        //     populate(player, gdata, gteam, team, opponents);
                        // });
                        for (Player in gdata.players) {
                            populate(Player,gdata,gteam,team,opponents);
                        }
                        $(container).append(team, opponents, join);
                        if (button === "SPECTATE") {
                            $(container).addClass("spectate");
                            join.href += "&spectate=true";
                        }
                        if (gdata.isFinished) {
                            $(container).addClass("finished");
                            finished.push(container);
                            $(join).html("VIEW SCORES");
                        }
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
                            firebase.database().ref("users/" + player).once("value", function(UID) {
                                if (gdata.players[player].team == gteam) { // team check: IF SAME TEAM
                                    $("#" + game + " > .team ").append((($("#" + game + " > .team ").html()) ? " • " : "") + UID.val().name);
                                } else if (gdata.players[player].team == (gteam == "red" ? "blue" : "red")) { // team check: IF OPPOSING TEAM ( NO ELSE )
                                    $("#" + game + " > .opp ").append((($("#" + game + " > .opp ").html()) ? " • " : "") + UID.val().name);
                                }
                            })
                        }
                    }
                }).then(function() {
                    finished.forEach(function(fgame) {
                        $("#gamecontainer").append(fgame);
                    })
                })
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
            $("[name=blue]").val().split(",").forEach(function(each) {
                players[each] = {
                    "team": "blue",
                    "perm": "play"
                }
            });
            $("[name=red]").val().split(",").forEach(function(each) {
                players[each] = {
                    "team": "red",
                    "perm": "play"
                }
            });
            firebase.database().ref("users/" + User.name + "/games").once("value", function(edata) {
                games = edata.val();
            })
            var roles = ["assassin", "bystander", "red", "blue"];

            function shuffleArray(a) {
                var i = a.length,
                    t, j;
                a = a.slice();
                while (--i) t = a[i], a[i] = a[j = ~~(Math.random() * (i + 1))], a[j] = t;
                return a;
            }
            roles = shuffleArray(roles);
            console.log(roles);
            key = firebase.database().ref('games').push({
                "DOC": new Date(),
                "board": {
                    "a1": {
                        "covered": false,
                        "role": roles[0],
                        "word": ""
                    },
                    "a2": {
                        "covered": false,
                        "role": roles[1],
                        "word": ""
                    },
                    "b1": {
                        "covered": false,
                        "role": roles[2],
                        "word": ""
                    },
                    "b2": {
                        "covered": false,
                        "role": roles[3],
                        "word": ""
                    }
                },
                "creator": User.name,
                "isFinished": false,
                "players": players,
                "turn": "red"
            }).key;
            games.push(key);
            firebase.database().ref("users/" + User.uid + "/games").set(games);
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
            if (isVisible) {
                closePop();
                isVisible = false;
            } else {
                $("#rules").css({
                    "top": 0,
                    "opacity": 1,
                    "z-index": 3
                });
                isVisible = true;
                Blur();
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
    })
});