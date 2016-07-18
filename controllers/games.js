'use strict';

module.exports = function(req, res) {
  req.firebase.database().ref('games').on('value', function(data) {
    res.send(data.val())
  });
};
