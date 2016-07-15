
var redTeam = [];
var blueTeam = [];
firebase.database().ref('games/'+fetchID()).once("value", function(data)
    {
        var boardState = data.val().board;
            for (name in data.val().players){ //Loops through the database to find members of the red team
                if (data.val().players[name].team == "red"){
                    redTeam.push(name); //Pushes memebers into an array
                }
                else if (data.val().players[name].team == "blue"){
                    blueTeam.push(name);
                }
            }console.log(redTeam,blueTeam);
            fill();
    }
)
    function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
var op = {
    name: "testUser"
}

firebase.database().ref("users/" + op.name).on('value', function(data) {
    var username = data.val() ? data.val().Name : "guest";
    $("#usr").html(cap(username));
});

$(".word").click(function(){
    firebase.database().ref("games/"+fetchID()+"/board/"+[this.parentElement.id]).update({
        covered: true
    })
});

firebase.database().ref("games/"+fetchID()+"/board").on("value",function(data){
 console.log(redTeam,blueTeam);
    fill(data);
})

function fill(data){
    for (var i = 0; i < redTeam.length; i++){
        console.log(i,redTeam,blueTeam);
        $("#redTeam").append("<span>"+redTeam[i]+"</span>");
    }
    for (var i = 0; i < blueTeam.length; i++){
        console.log(i);
        $("#blueTeam").append("<span>"+blueTeam[i]+"</span><br>");
    }

    $(".square").filter(function(square,i){
        console.log(square,i.id);
        $("#"+i.id+" > .word").html("word? "+data.val()[i.id].word+"<br>")
    })

    $(".square").filter(function(square,i){
       $("#"+i.id+" > .covered").html("covered? "+data.val()[i.id].covered+"<br>")
    })

    $(".square").filter(function(square,i){
       $("#"+i.id+" > .role").html("role? "+data.val()[i.id].role+"<br>")
    })
}

function fetchID(){
    return window.location.href.substr(window.location.href.indexOf("?g=")+3);
}