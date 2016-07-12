function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
var op = {
    name: "testUser"
}
firebase.database().ref("users/" + op.name).on('value', function(snapshot) {
$("body > section").htm
    $("#usr").html(cap(snapshot.val().Name || "guest"));
    snapshot.val().games.filter(function(z) {
        create(z)
    })
});

function create(a) {
    var game = document.createElement("section");
    var team = document.createElement("div");
    var opponents = document.createElement("div");
    var gamecode = document.createElement("div");
    var join = document.createElement("a");
    join.id="join";
    join.innerHTML = "Join Game";
    join.href ="play.html?g="+a.URI;
    $(team).html("Team: "+a.team.join(", "));
    $(opponents).html("Opponents: "+a.opp.join(", "));
    $(gamecode).html("Game Code: " + a.URI);
    $(game).append(team, opponents, gamecode,join);
    $("body").append(game);
}
$("#new").click(function(){
    $("#setup").css("opacity","1");
    $("body").css("opacity","0.4")
})