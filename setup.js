// Run this function when the window is loaded to set up everything
$(function () {
	
	var UPDATE_INTERVAL = 1 * 1000; // 1 second
	DEBUG = true; // (global on purpose for convenience)

	// create the drawing pad object and associate with the canvas
	var pad = Pad(document.getElementById('canvas'));
	pad.clear();

	// create the board object and get an initial state
	board = Board(pad, 4, 4); // (global on purpose for convenience)
	board.reset();

	// create the life object
	life = Life(board); // (global on purpose for convenience)

	// update life every UPDATE_INTERVAL ms
	var interval = window.setInterval(life.update, UPDATE_INTERVAL);

	// Stop the game of life at the current generation
	// (global on purpose for convenience)
	stopLife = function () {
		window.clearInterval(interval);
	};

	// Resume the game of life from the current generation
	// (global on purpose for convenience)
	resumeLife = function () {
		interval = window.setInterval(life.update, UPDATE_INTERVAL);
	};

});