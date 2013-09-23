// Run this function when the window is loaded to set up everything

// This file acts as the controller between Board, Life (the models) and DrawableGrid (the view)
$(function () {

	var UPDATE_INTERVAL = 1 * 1000; // 1 second
	DEBUG = true; // (global on purpose for convenience)
	var SIZE = 40;

	// create the DOM elements for the game		
	grid = DrawableGrid(SIZE, SIZE);

	// (approximately) what fraction of cells should be alive in the random initial state
	var DEFUALT_PERCENT_CELLS_OCCUPIED = .4;
	// create the board object and get an initial state
	board = Board(SIZE, SIZE); // (global on purpose for convenience)

	// create the life object
	life = Life(board); // (global on purpose for convenience)

	// Register listeners between board and grid (model and view)
	board.register_listener_on_set(grid.draw_cell);
	grid.register_cell_click_listener(life.set_alive);
	
	life.reset_random();

	// whether the game is currently playing or paused
	var playing = false;

	// update life every UPDATE_INTERVAL ms
	var interval;

	// Stop the game of life at the current generation if not already stopped
	var pauseLife = function () {
		if (playing === true) {
			print("Pausing game");
			playing = false
			window.clearInterval(interval);
		}
	};

	// Resume the game of life from the current generation if not already playing
	var resumeLife = function () {
		if (playing === false) {
			print("Resuming game");
			playing = true;
			interval = window.setInterval(life.update, UPDATE_INTERVAL);
		}
	};

	// Set the play button to resume the game only if not playing
	$("#play-btn").click(resumeLife);

	// Set the pause button to pause the game only if playing
	$("#pause-btn").click(pauseLife);

	// Set the clear button to pause the game and clear the board and grid, and pause the game
	$("#clear-btn").click(function (event) {
		print("Clearing board");
		$("#pause-btn").click();
		grid.draw_empty_grid();
		life.clear();
	});

	// Set the random button to pause the game and reset the game 
	// to a random state
	$("#random-btn").click(function (event) {
		print("Setting random initial state");
		life.reset_random();
	});

	// Set the dropdown menu to update the button with the selected option from the menu
	$(".dropdown-menu li a").click(function (event) {
	  var selText = $(this).text();
	  $(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
	});

	// Set the 'normal' option of the dropdown to change the rules of life to normal
	$("#normal-btn").click(function (event) {
		pauseLife();
		print("Normal option selected");
		life.set_game_rules_normal();
		resumeLife();
	});

	// Set the 'war' option of the dropdown to change the rules of life to war
	$("#war-btn").click(function (event) {
		pauseLife();
		print("War option selected");
		life.set_game_rules_war();
		resumeLife();
	});

	// Set the 'peace' option of the dropdown to change the rules of life to peace
	$("#peace-btn").click(function (event) {
		pauseLife();
		print("Peace option selected");
		life.set_game_rules_peace();
		resumeLife();
	});

});