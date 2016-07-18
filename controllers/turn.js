'use strict';

module.exports = function(req, res) {
  req.firebase.database().ref('games').once('value', function(data) {
    res.send(data.val())
  });
};
