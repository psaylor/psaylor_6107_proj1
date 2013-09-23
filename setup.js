// Run this function when the window is loaded to set up everything
$(function () {
	
	// Randomly sets each cell to either occupied or vacant according to DEFUALT_PERCENT_CELLS_OCCUPIED 
	var set_random = function () {
		grid.draw_empty_grid();
		board.clear();
		board.for_each_cell(function (coord) {
			if ((Math.random() + DEFUALT_PERCENT_CELLS_OCCUPIED) >= 1) {
				board.set(coord);
			}
		});
	};

	var UPDATE_INTERVAL = 1 * 1000; // 1 second
	DEBUG = true; // (global on purpose for convenience)
	var SIZE = 20;

	// create the DOM elements for the game		
	grid = DrawableGrid(SIZE, SIZE);

	// (approximately) what fraction of cells should be alive in the random initial state
	var DEFUALT_PERCENT_CELLS_OCCUPIED = .4;
	// create the board object and get an initial state
	board = Board(SIZE, SIZE); // (global on purpose for convenience)

	// create the life object
	life = Life(board); // (global on purpose for convenience)

	// Register listeners between board and grid (model and view)
	board.register_listener_on_set(grid.draw_occupied_cell);
	board.register_listener_on_clear(grid.draw_vacant_cell);
	grid.register_cell_click_listener(life.set_alive);
	
	life.randomize();

	var playing = false;

	// Set the play button to resume the game only if not playing
	$("#play-btn").click(function (event) {
		if (playing === false) {
			print("Resuming game");
			playing = true;
			resumeLife();
		}
	});

	// Set the pause button to pause the game only if playing
	$("#pause-btn").click(function (event) {
		if (playing === true) {
			print("Pausing game");
			playing = false
			pauseLife();
		}
	});

	// Set the clear button to pause the game and reset the 
	// game to a random state
	$("#clear-btn").click(function (event) {
		print("Clearing board");
		$("#pause-btn").click();
		grid.draw_empty_grid();
		life.reset();
	});

	// Set the random button to pause the game and reset the game 
	// to a random state
	$("#random-btn").click(function (event) {
		print("Setting random initial state");
		$("#pause-btn").click();
		life.randomize();
	});

	// Set the separate button to pause the game and reset the board,
	// separating the cells into 4 quadrants of different colors
	// where the rules of life are modified
	$("#separate-btn").click(function (event) {
		print("Separating the cells");
		$("#pause-btn").click();
		life.separate_by_quadrant();
	});


	// update life every UPDATE_INTERVAL ms
	var interval;

	// Stop the game of life at the current generation
	// (global on purpose for convenience)
	pauseLife = function () {
		window.clearInterval(interval);
	};

	// Resume the game of life from the current generation
	// (global on purpose for convenience)
	resumeLife = function () {
		interval = window.setInterval(life.update, UPDATE_INTERVAL);
	};

	stepLife = function () {
		life.update();
	};

});