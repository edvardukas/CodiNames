var express = require('express'),
    app = express(),
    firebase = require('firebase'),
    cors = require('cors'),
    firebaseConfig = require('./firebase.json'),
    port = 3000,
    firebaseApp = firebase.initializeApp(firebaseConfig.database),
    bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'null');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.static('public'));

app.post("/turn",function(req,res){
    var nextTurn,
        player;
    firebase.database().ref("games/"+req.body.game).once("value",function(game){
        player = game.val().players[req.body.name];
        nextTurn = (game.val().turn == "red")? "blue":"red";
        if (player.team === game.val().turn) {
            firebase.database().ref("games/"+req.body.game+"/turn").set(nextTurn).then(function(){
                res.send(game.val().board[req.body.square].role);
            })
        } else res.send("NOT UR GO");
    })
    firebase.database().ref("games/"+req.body.game+"/board/"+req.body.square+"/covered").set("true");
})
app.listen(port, function() {
  console.log('Express listening on port ' + port);
});



