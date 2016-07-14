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
    firebase.database().ref('games/'+fetchID()+).once("value",
        function(data){
            var DOC = data.val().DOC;
            var boardState = {
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
                    }
                    2: {
                        covered: false,
                        role: null,
                        word: null
                    }
                }
            }

            var redTeam = data.val().players
            var blueTeam =
            console.log(boardState,DOC,redTeam,blueTeam);
        }
    )
}

function fetchID(){
    return window.location.href.substr(window.location.href.indexOf("?g=")+3);
}