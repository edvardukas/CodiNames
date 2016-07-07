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
});
