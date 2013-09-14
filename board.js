// An abstraction for the game board that maintains the state of the board
// and provides functions for checking the state (XXXXXXXX) 
// and modifying that state (add/remove/reset)
// An optional cell_size may be provided (defaults to DEFAULT_CELL_SIZE otherwise),
// which determines the size of each square on the board. T
var Board = function (pad, cell_size) {

	var DEFAULT_CELL_SIZE = 5;
	var OCCUPIED = 1;
	var VACANT = 0;
	var OCCUPIED_COLOR = Color(0, 255, 0); //green
	var VACANT_COLOR = Color(0, 0, 0); // black
	var BOARD_COLOR = Color(0, 0, 0); // black

	cell_size = (cell_size) ? cell_size : DEFAULT_CELL_SIZE;

	var height = pad.get_height() / cell_size;
	var width = pad.get_width() / cell_size;

	// set constants to be able to scale to any canvas size
	var MAX_X = 100;
	var MAX_Y = 100;
	var x_factor = pad.get_width() / MAX_X;
	var y_factor = pad.get_height() / MAX_Y;
	var LINE_WIDTH = 2;

	// An array of arrays representing the 2D board state
	// If boardState[row][col] is 0, then the cell at x=col and y=row
	// is not occupied; otherwise it is occupied.
	// Note: x,y can be accessed as boardState[y][x]
	var boardState = [];
	// initialize boardState
	var initialize_empty = function() {
		from_to(0, height - 1, function (row) {
			boardState[row] = [];
			from_to(0, width - 1, function (col) {
				boardState[row][col] = 0;
			})
		});
	};

	var check_rep_invariants = function() {
		if (lessThanEqualTo(height, 0)) {
			printError("Invalid height.");
			return false;
		}
		if (lessThanEqualTo(width, 0)) {
			printError("Invalid width.");
			return false;
		}

		from_to(0, height - 1, function (row) {
			if (boardState[row].length === width) {
				printError("Invalid row length. Row: " + row);
				return false;
			}
			from_to(0, width - 1, function (col) {
				if (!(boardState[row][col] === 0) || !(boardState[row][col] === 1)) {
					printError("Invalid cell value. Cell (row, col): (" + row + ", " + col + ")");
				}
			})
		});
	};

	var draw_occupied_cell = function (coord) {
		pad.draw_circle(Coord(coord.x*x_factor, coord.y*y_factor),
					cell_size, LINE_WIDTH, OCCUPIED_COLOR, OCCUPIED_COLOR);
	};

	var draw_vacant_cell = function (coord) {

	};

	var draw_clear_all = function (coord) {
		pad.clear();
		draw_board();
	};

	var draw_board = function (coord) {
		pad.draw_rectangle(Coord(0, 0), pad.get_width(), pad.get_height(), 10, BOARD_COLOR);
	}

	initialize_empty();
	check_rep_invariants();

	return {
		// Adds a piece at coord to the board's representation 
		// and display
		add: function (coord) {
			boardState[coord.y][coord.x] = OCCUPIED;
			draw_occupied_cell(coord);
		},

		// Removes the piece at coord from the board's representation
		// and display
		remove: function (coord) {
			boardState[coord.y][coord.x] = VACANT;
			draw_vacant_cell(coord);
		},

		get_cell: function (coord) {
			return boardState[coord.y][coord.x];
		},

		get_coords_of_all_occupied_cells: function () {

		},

		// Resets the state of the board to a new initial state.
		// If seed is provided, it will be used to randomly populate
		// the board's new initial state.
		reset: function (seed) {
			initialize_empty();
			draw_clear_all();
		},

		// Clears the board.
		clear: function () {
			initialize_empty();
			draw_clear_all();
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