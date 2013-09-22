// constructor for 2D coordinate
var Coord = function (x, y) {
	return {
		x: x, 
		y: y, 
		row: y, 
		col: x,
		equals: function (coord) {
			return ((x === coord.x) && (y === coord.y));
		},
		toString: function (coord) {
			return "Coord (x: " + x + ", y: " + y + ")";
		}};
	};

var BoardValue = function (value) {
	var value = value;
	var EMPTY = 0;
};

// A classic abstraction for a game board that maintains the state of the board
// and provides functions for 
// 1. checking the state (is_occupied/is_vacant, get all occupied cells, etc.) 
// 2. modifying that state (add/remove/clear, etc.)
// An optional height and width may be provided (defaults to DEFAULT_HEIGHT
// and DEFAULT_WIDTH otherwise), which determines the number of cells on the board
var Board = function (height, width) {

	var DEFAULT_HEIGHT = 40;
	var DEFAULT_WIDTH = 40;

	// value of a vacant cell
	var EMPTY = 0;

	// use the default values if 
	// 1. height or width is undefined
	// 2. height or width is the wrong type
	if ((height === undefined) || (!isNumber(height))) {
		height = DEFAULT_HEIGHT;
	}
	if ((width === undefined) || (!isNumber(width))) {
		width = DEFAULT_WIDTH;
	}

	// An array of arrays representing the 2D board state
	// If board_state[row][col] is 0, then the cell at x=col and y=row
	// is vacant; if board_state[row][col] is 1, it is occupied.
	// Note: x,y can be accessed as board_state[y][x]
	// Rep invariants:
	// 1. the number of rows, board_state.length === height
	// 2. the number of cols, board_state[r].length === width for 0<=r<height
	// 3. board_state[r][c] is either 0 or 1 for all r,c
	var board_state;

	// Registered listeners on the set_cell function
	var listeners_of_set = [];
	// Registered listeners on the clear_cell function
	var listeners_of_clear = [];

	
	// Initialize the board_state object as a 2D array of all vacant cells
	var initialize_empty_board = function () {
		board_state = [];
		from_to(0, height - 1, function (row) {
			board_state[row] = [];
		});
		clear_board_state();
	};

	// Clear all cells in board_state so they are vacant
	var clear_board_state = function () {
		self.for_each_cell(function (coord) {
			self.clear_cell(coord);
		});
		if (DEBUG) {
			check_rep_invariants();
		}
	};

	// Check the rep invariants of Board
	var check_rep_invariants = function () {
		if (lessThanEqualTo(height, 0)) {
			printError(pad.get_height());
			printError("Invalid height " + String(height));
			return false;
		}
		if (lessThanEqualTo(width, 0)) {
			printError("Invalid width " + String(width));
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
	};

	// A recursive helper method to replace a nested for loop. It creates a Coord object from 
	// each pair of (row, col) in the provided range and calls f on each coord 
	var from_to_2D_board = function (from_row, to_row, from_col, to_col, f) {
		if (from_row > to_row) return;
		from_to(from_col, to_col, function (col) {
			coord = Coord(col, from_row);
			f(coord);
		});
		from_to_2D_board(from_row + 1, to_row, from_col, to_col, f);
	};
	
	// the object to be returned that holds all of board's "public" functions
	var self = createObject(Board.prototype);

	// Sets the cell at coord in board_state to value if coord is in range
	// Returns true if the cell was set to value, false otherwise
	self.set_cell = function (coord, value) {
		if (lessThan(coord.row, height) && lessThan(coord.col, width) && lessThanEqualTo(0, coord.row) && lessThanEqualTo(0, coord.col)) {
			board_state[coord.row][coord.col] = value;
			listeners_of_set.each( function (listener) {
				listener(coord, value);
			});
			return true;
		} else {
			printError("Coord " + String(coord) + " out of range");
		}
		if (DEBUG) {
			check_rep_invariants();
		}
		return false;
	};

	// Clears the cell at coord in board_state by setting its value to 0 if coord is in range
	// Returns true if the cell was successfully cleared, false otherwise
	// TODO: abstract away from cell type/value
	self.clear_cell = function (coord) {
		if (lessThan(coord.row, height) && lessThan(coord.col, width) && lessThanEqualTo(0, coord.row) && lessThanEqualTo(0, coord.col)) {
			board_state[coord.row][coord.col] = 0;
			listeners_of_clear.each( function (listener) {
				listener(coord);
			});
			return true;
		} else {
			printError("Coord " + String(coord) + " out of range");
		}
		if (DEBUG) {
			check_rep_invariants();
		}
		return false;
	}

	// Returns the value of the cell at coord in board_state if coord is in range, otherwise undefined
	self.get_cell = function (coord) {
		if (lessThan(coord.row, height) && lessThan(coord.col, width)) {
			return board_state[coord.row][coord.col];
		} else {
			printError("Coord " + String(coord) + " out of range");
			return undefined;
		}
	};

	// Register a listener function on the set_cell function.
	// The listener should take a coord as the first parameter, 
	// and the value set on the cell as the second parameter.
	// The listener cannot be later removed.
	self.register_listener_on_set = function (listener) {
		listeners_of_set.push(listener);
	};

	// Register a listener function on the clear_cell function.
	// The listener should take a coord as the first parameter.
	// The listener cannot be later removed.
	self.register_listener_on_clear = function (listener) {
		listeners_of_clear.push(listener);
	};

	// Returns a list of coords that are on the board and that neighbor the given coord
	// (that is, they share a side or corner)
	self.get_neighbors = function (coord) {
		neighbors = [];
		var from_row = Math.max(coord.row - 1, 0);
		var to_row = Math.min(coord.row + 1, height - 1);
		var from_col = Math.max(coord.col - 1, 0);
		var to_col = Math.min(coord.col + 1, width - 1);
		from_to_2D_board(from_row, to_row, from_col, to_col, function (neighborCoord) {
			if (!coord.equals(neighborCoord)) {
				neighbors.push(neighborCoord);
			}
		});
		return neighbors;
	};

	// Apply the function f(coord) to each coord in the board
	self.for_each_cell = function (f) {
		from_to_2D_board(0, height - 1, 0, width - 1, f);
	};

	// Clears the board so it is completely empty. Updates the display.
	self.clear = function () {
		clear_board_state();
	},

	// Returns the height of the board in terms of number of cells.
	self.get_height = function () {
		return height;
	},

	// Returns the width of the board in terms of number of cells.
	self.get_width = function () {
		return width;
	},

	// Returns a string representation of the board
	self.toString = function () {
		str = "";
		for (var r=0; r < height; r++) {
			for (var c=0; c < width; c++) {
				str+= board_state[r][c] + ", ";
			}
			str+= "\n";
		}
		return str;
	}

	initialize_empty_board();
	if (DEBUG) {
		check_rep_invariants();
	}
	Object.freeze(self);
	return self;
}