var express = require('express'),
    app = express(),
    firebase = require('firebase'),
    firebaseConfig = require('./firebase.json'),
    port = 3000,
    firebaseApp = firebase.initializeApp(firebaseConfig.database),
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));

app.post("/turn", function (req, res) {
    var nextTurn,
        player;
    firebase.database().ref("games/" + req.body.game).once("value", function (game) {
        console.log(game.val().players[req.body.name]);
        player = game.val().players[req.body.name];
        nextTurn = (game.val().turn == "red") ? "blue" : "red";
        console.log(req.body.square,nextTurn);
        if (player.team === game.val().turn) {
            firebase.database().ref("games/" + req.body.game + "/board/" + req.body.square + "/covered").set(true);
            if (game.val().board[req.body.square].role == "assassin") {
                for (square in game.val().board) {
                    firebase.database().ref("games/" + req.body.game + "/board/"+square+"/covered").set(true);
                    firebase.database().ref("games/" + req.body.game + "/isFinished").set(true);
                }
            }
            if (game.val().board[req.body.square].role == nextTurn || game.val().board[req.body.square].role == "bystander") {
                firebase.database().ref("games/" + req.body.game + "/turn").set(nextTurn)
            }

        } else res.send();
    })
    res.send();
})
app.listen(port, function () {
    console.log('Express listening on port ' + port);
});
