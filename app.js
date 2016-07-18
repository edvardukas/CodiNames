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

app.post("/turn",function(req,res){
    console.log(req.body.game,req.body.square);
    firebase.database().ref("games/"+req.body.game).once("value",function(game){
        if (game.val().players[req.body.name].team == game.val().turn) firebase.database().ref("games/"+req.body.game+"/turn").set((game.val().turn == "red")?"blue":"red");
    }).then(function(game){
        $(game.val().players[req.body.name].team == game.val().turn)
        res.send(game.val().board[req.body.square].role);
    })
    firebase.database().ref("games/"+req.body.game+"/board/"+req.body.square+"/covered").set("true");
})
app.listen(port, function() {
  console.log('Express listening on port ' + port);
});
