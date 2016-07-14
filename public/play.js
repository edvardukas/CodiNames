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
            var DOC = data.val().DOC; //Date of Creation

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

            console.log(boardState,DOC,redTeam,blueTeam);
            constructBoard(boardState, redTeam, blueTeam);
        }
    )
}

function constructBoard(state, redTeam, blueTeam){
    var board = document.getElementById("board")
    var a1 = document.createElement("div"),
    a2 = document.createElement("div"),
    b1 = document.createElement("div"),
    b2 = document.createElement("div")
    $(a1).addClass("square"); //Tomorrow add IDs for each of these so that you can split them into colours on a team by team basis
    $(a2).addClass("square");
    $(b1).addClass("square");
    $(b2).addClass("square");
    $(a1).html("a1 <br>"
    +"Covered? "+state.a[1].covered+"<br>"
    +"Role? "+state.a[1].role+"<br>"
    +"Word? "+state.a[1].word+"<br>"
    );

    $(a2).html("a2 <br>"
    +"Covered? "+state.a[2].covered+"<br>"
    +"Role? "+state.a[2].role+"<br>"
    +"Word? "+state.a[2].word+"<br>"
    );

    $(b1).html("b1 <br>"
    +"Covered? "+state.b[1].covered+"<br>"
    +"Role? "+state.b[1].role+"<br>"
    +"Word? "+state.b[1].word+"<br>"
    );

    $(b2).html("b2 <br>"
    +"Covered? "+state.b[2].covered+"<br>"
    +"Role? "+state.b[2].role+"<br>"
    +"Word? "+state.b[2].word+"<br>"
    );

    $(board).append(a1,a2,b1,b2);


}

function fetchID(){
    return window.location.href.substr(window.location.href.indexOf("?g=")+3);
}


$(document).ready(showGameData())