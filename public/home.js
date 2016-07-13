function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
var op = {
    name: "testUser"
}
var test;
firebase.database().ref("users/" + op.name).on('value', function(snapshot) {
    $("#usr").html(cap(snapshot.val().Name || "guest"));
    snapshot.val().games.filter(function(z) {
        test=z;
        create(z)
    })
});

firebase.database().ref("users/" + op.name + "/games").on('child_removed', function(data) {
    $("#" + data.val().URI).remove();
});

function create(a) {
    if (!$("#" + a.URI)[0]) /* checks if game is already in list */ {
        var game = document.createElement("section");
        var team = document.createElement("div");
        var opponents = document.createElement("div");
        var gamecode = document.createElement("div");
        var join = document.createElement("a");
        game.id = a.URI;
        team.className = "team";
        opponents.className = "opp";
        gamecode.className = "gamecode";
        join.className = "join ";
        join.innerHTML = "Join Game";
        join.href = "play.html?g=" + a.URI;
        $(team).html("Team: " + a.team.join(", "));
        $(opponents).html("Opponents: " + a.opp.join(", "));
        $(gamecode).html("Game Code: " + a.URI);
        $(game).append(team, opponents, gamecode, join);
        $("#gamecontainer").append(game);
    } else {
        $("#" + a.URI + "> .team").html("Team: " + a.team.join(", "));
        $("#" + a.URI + "> .opp").html("Opponents: " + a.opp.join(", "));
        $("#" + a.URI + "> .gamecode").html("Game Code: " + a.URI);
        $("#" + a.URI + "> .join")[0].href = "play.html?g=" + a.URI;
    }
}
$("#new").click(function() {
    $("#setup").css({
        "opacity": 1,
        "z-index": 3
    });
    $("#cover").css({
        "opacity": 1,
        "z-index": 2
    });
})
$("#close").click(function() {

    $("#setup, #cover").css({
        "opacity": 0,
    })
    setTimeout(function() {
        $("#setup, #cover").css({
            "z-index": -1,
        })
    }, 300)
})