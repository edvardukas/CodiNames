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
});

function showGameData () {
    firebase.database().ref('games/'+fetchID()).once("value", function(data)
        {
            //var DOC = data.val().DOC; Date of Creation

            var boardState = { //creates the game board object
                a: {
                    1: {
                        covered: false,
                        role: null,
                        word: null
                    },
                    2: {
                        covered: false,
                        role: null,
                        word: null
                    }
                },
                b: {
                    1: {
                        covered: false,
                        role: null,
                        word: null
                    },
                    2: {
                        covered: false,
                        role: null,
                        word: null
                    }
                }
            }

            var boardState = data.val().board;

            var redTeam = [];
            var blueTeam = [];
            for (name in data.val().players){ //Loops through the database to find members of the red team
                if (data.val().players[name].team == "red"){
                    redTeam.push(name); //Pushes memebers into an array
                }
                else{
                    blueTeam.push(name);
                }
            }

            console.log(boardState,redTeam,blueTeam);
            constructBoard(boardState, redTeam, blueTeam);
        }
    )
}

function constructBoard(state, redTeam, blueTeam){

    console.log(state);

    $("#a1 > covered").html("covered? "+a1.covered+"<br>");
    $("#a2 > covered").html("covered? "+state.a2.covered+"<br>");
    $("#b1 > covered").html("covered? "+state.b1.covered+"<br>");
    $("#b2 > covered").html("covered? "+state.b2.covered+"<br>");

    $("#a1 .role").html("role? "+state.a1.role+"<br>");
    $("#a2 .role").html("role? "+state.a1.role+"<br>");
    $("#b1 .role").html("role? "+state.b1.role+"<br>");
    $("#b2 .role").html("role? "+state.b2.role+"<br>");

    $("#a1 .word").html("Word? "+state.a1.word+"<br>");
    $("#a2 .word").html("Word? "+state.a2.word+"<br>");
    $("#b1 .word").html("Word? "+state.b1.word+"<br>");
    $("#b2 .word").html("Word? "+state.b2.word+"<br>");
}

    $(".word").click(function(){
    firebase.database().ref("games/"+fetchID()+"/board/"+[this.parentElement.id]).update({
        covered: true
    })
    console.log([this.id]+"changed");
    $()


});


function fetchID(){
    return window.location.href.substr(window.location.href.indexOf("?g=")+3);
}



$(document).ready(showGameData())