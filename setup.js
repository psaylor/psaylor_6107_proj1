// Run this function when the window is loaded to set up everything
$(function () {
	
	var UPDATE_INTERVAL = 1 * 1000; // 1 second
	DEBUG = true; // (global on purpose for convenience)

	// create the DOM elements for the game
	
// (approximately) what fraction of cells should be alive in the random initial state
	var DEFUALT_PERCENT_CELLS_OCCUPIED = .4;
	// create the board object and get an initial state
	board = Board(); // (global on purpose for convenience)

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