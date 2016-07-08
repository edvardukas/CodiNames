$(document).ready(function(){

	// Define initial style of the button
	var initial_width = 500;
	var initial_height = 100;
	$("#magic-button").css({
		"width": initial_width + "px",
		"height": initial_height + "px"});

	// Function that decreases the size of the button in steps
	function decrease_button(magic_button, current_timeout) {
		initial_width -= 5;
		initial_height -= 1;

		if (initial_width <= 90 || initial_height <= 18) {
			$(magic_button).remove();
		} else {
			$(magic_button).css({
				"width": initial_width + "px",
				"height": initial_height + "px"});
			var new_timeout = current_timeout > 5 ? current_timeout - 1 : 5;
			setTimeout(decrease_button, new_timeout, magic_button, new_timeout)
		}
	};

	// Define the logic that happens after button is clicked
	$("#magic-button").click(function(){
		$(this).html("<i>Boom!</i>");
		var starting_timeout = 40;
		setTimeout(decrease_button, starting_timeout, "#magic-button", starting_timeout)
	});

	firebase.database().ref('users/testUser/games').on('value', function(snapshot) {
		snapshot.val().forEach(function(gameNumber) {
			$("#games-for-current-user-div").append(
			"<form action='gamepage.html'>" +
                "<input type='submit' value='Game " + gameNumber+ "'>" +
                "<input type='hidden' name='game_id' value='" + gameNumber + "'>" +
            "</form>"
			)
		});
	});
});

// The following function are just examples of how communication with the firebase database works and should not
// be used later
function databaseInit() {
	firebase.database().ref('users/testUser').set({
		username: "testUser",
		games: [1, 2],
		game1: {
			el_11: {
				word: "dog",
				covered: true,
				role: "white"
			},
			el_12: {
				word: "cat",
				covered: true,
				role: "green"
			},
			el_21: {
				word: "airplane",
				covered: true,
				role: "spy"
			},
			el_22: {
				word: "desert",
				covered: true,
				role: "citizen"
			},
		},
		game2: {
			el_11: {
				word: "bird",
				covered: true,
				role: "white"
			},
			el_12: {
				word: "guide",
				covered: true,
				role: "green"
			},
			el_21: {
				word: "linux",
				covered: true,
				role: "spy"
			},
			el_22: {
				word: "window",
				covered: true,
				role: "citizen"
			},
		},
	  });
}

function updateField() {
	firebase.database().ref('users/testUser/game1/el_12').update({"covered": true})
}
