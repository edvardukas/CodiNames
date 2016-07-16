define(['jquery', 'firebase'], function($, firebase) {
    var game = decodeURIComponent((new RegExp('[?|&]g=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;

    firebase.database().ref('games/' + game).once("value", function(data) {
        for (player in data.val().players) { // Loops through the database to find members of the red team
            if (data.val().players[player].team == "red") {
                $("#redTeam").append("<span>"+player+"</span><br/>")
            } else if (data.val().players[player].team == "blue") {
                $("#blueTeam").append("<span>"+player+"</span><br/>")
            }
        }
        fill(data.val());
    })

    $(".word").click(function() {
        firebase.database().ref("games/" + fetchID() + "/board/" + [this.parentElement.id]).update({
            covered: true
        })
    });

    firebase.database().ref("games/" + fetchID() + "/board").on("value", function(data) {
        console.log(redTeam, blueTeam);
        fill(data);
    })

    function fill(data) {
        for (var i = 0; i < redTeam.length; i++) {
            console.log(i, redTeam, blueTeam);
            $("#redTeam").append("<span>" + redTeam[i] + "</span><br/>");
        }
        for (var i = 0; i < blueTeam.length; i++) {
            console.log(i);
            $("#blueTeam").append("<span>" + blueTeam[i] + "</span><br/>");
        }

        $(".square").filter(function(square, i) {
            console.log(square, i.id);
            $("#" + i.id + " > .word").html("word? " + data.val()[i.id].word + "<br>")
        })

        $(".square").filter(function(square, i) {
            $("#" + i.id + " > .covered").html("covered? " + data.val()[i.id].covered + "<br>")
        })

        $(".square").filter(function(square, i) {
            $("#" + i.id + " > .role").html("role? " + data.val()[i.id].role + "<br>")
        })
    }

    function fetchID() {
        return window.location.href.substr(window.location.href.indexOf("?g=") + 3);
    }
})