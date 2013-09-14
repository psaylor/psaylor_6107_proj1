// An abstraction for the game board that maintains the state of the board
// and provides functions for checking the state (XXXXXXXX) 
// and modifying that state (add/remove/reset)
// An optional cell_size may be provided (defaults to DEFAULT_CELL_SIZE otherwise),
// which determines the size of each square on the board. T
var Board = function (pad, height, width) {

	var DEFAULT_HEIGHT = 40;
	var DEFAULT_WIDTH = 40;

	var DEFUALT_PERCENT_CELLS_OCCUPIED = .4;
	var OCCUPIED = 1;
	var VACANT = 0;

	var OCCUPIED_COLOR = Color(48, 131, 48); //green
	var VACANT_COLOR = Color(0, 0, 0); // black
	var BOARD_COLOR = Color(0, 0, 0); // black
	var LINE_WIDTH = 1;
	var BOARD_MARGIN = 1;

	// use the default values if height or widths is not defined
	height = (height) ? height : DEFAULT_HEIGHT;
	width = (width) ? width : DEFAULT_WIDTH;

	// use the default values if height or width is larger than 
	// the corresponding pad dimension
	if (lessThan(pad.get_height(), height)) {
		height = DEFAULT_HEIGHT;
	}
	if (lessThan(pad.get_width(), width)) {
		width = DEFAULT_WIDTH;
	}

	var cell_height = pad.get_height() / height;
	var cell_width = pad.get_width() / width;	

	// An array of arrays representing the 2D board state
	// If board_state[row][col] is 0, then the cell at x=col and y=row
	// is not occupied; otherwise it is occupied.
	// Note: x,y can be accessed as board_state[y][x]
	var board_state = [];
	// initialize board_state
	var initialize_empty_board = function () {
		from_to(0, height - 1, function (row) {
			board_state[row] = [];
		});
		clear_board();
	};

	var clear_board = function () {
		for_each_cell_in_board(function (row, col) {
			board_state[row][col] = 0;
		});
	}

	var check_rep_invariants = function () {
		if (lessThanEqualTo(height, 0) || lessThan(pad.get_height(), height)) {
			printError("Invalid height.");
			return false;
		}
		if (lessThanEqualTo(width, 0) || lessThan(pad.get_width(), width)) {
			printError("Invalid width.");
			return false;
		}

		var rep_invariants_satisfied = true;
		from_to_quick_escape(0, height - 1, function (row) {
			if (!(board_state[row].length === width)) {
				printError("Invalid row length. Row: " + row + ", Length: " + board_state[row].length);
				rep_invariants_satisfied = false;
				return false;
			}
		});
		from_to_2D_quick_escape(0, height - 1, 0, width - 1, function (row, col) {
			if (!(board_state[row][col] === 0) && !(board_state[row][col] === 1)) {
				printError("Invalid cell value. Cell (row, col): (" + row + ", " + col + ") has value " + board_state[row][col]);
				rep_invariants_satisfied = false;
				return false;
			}
		});
	};

	var set_random_initial_state = function () {
		for_each_cell_in_board(function (row, col) {
			board_state[row][col] = Math.floor(Math.random() + DEFUALT_PERCENT_CELLS_OCCUPIED);
		});
	}

	/* METHODS FOR DRAWING ON THE PAD*/
	// takes a Coord object in terms of the board's coordinate system and
	// returns a Coord object in terms of the pad's coordinate system
	var board_to_pad_coords = function (coord) {
		var x = coord.col * cell_width;
		var y = coord.row * cell_height;
		return Coord(x, y);
	}

	var draw_occupied_cell = function (coord) {
		pad_coord = board_to_pad_coords(coord);
		pad.draw_rectangle(pad_coord, cell_height, cell_width, LINE_WIDTH, BOARD_COLOR, OCCUPIED_COLOR);
	};

	var draw_empty_board = function () {
		pad.clear();
		pad.draw_rectangle(Coord(0, 0), pad.get_width(), pad.get_height(), 
			BOARD_MARGIN, BOARD_COLOR);
	};

	var redraw_board = function () {
		draw_empty_board();
		for_each_cell_in_board(function (row, col) {
			coord = Coord(col, row);
			var occ = get_cell(coord);
			if (occ === OCCUPIED) {
				draw_occupied_cell(coord)
			}
		});
	};

	var get_cell = function (coord) {
		return board_state[coord.y][coord.x];
	};

	var for_each_cell_in_board = function (f) {
		from_to_2D(0, height - 1, 0, width - 1, f);
	};

	initialize_empty_board();
	check_rep_invariants();

	return {
		// Adds a piece at coord to the board's representation 
		// and display
		add: function (coord) {
			board_state[coord.y][coord.x] = OCCUPIED;
			draw_occupied_cell(coord);
		},

		// Removes the piece at coord from the board's representation
		// and display
		remove: function (coord) {
			board_state[coord.y][coord.x] = VACANT;
			draw_vacant_cell(coord);
		},

		get: function (coord) {
			return get_cell(coord);
		},

		get_coords_of_all_occupied_cells: function () {

		},

		// Resets the state of the board to a new initial state.
		// If seed is provided, it will be used to randomly populate
		// the board's new initial state.
		reset: function () {
			set_random_initial_state();
			redraw_board();
		},

		// Clears the board.
		clear: function () {
			clear_board();
			draw_empty_board();
		},

		// return height and width of the game board in terms of number of cells
		get_height: function () {
			return height;
		},
		get_width: function () {
			return width;
		}
	}

}