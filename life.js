// An abstraction for the rules of the game of life. Takes a Board object
// to play the game on.
var Life = function (board) {

	var generation_number = 0;

	var DEAD = 0;
	var ALIVE_A = 1;
	var ALIVE_B = 2;
	var ALIVE_C = 3;
	var ALIVE_D = 4;

	// (approximately) what fraction of cells should be alive in the random initial state
	var DEFUALT_PERCENT_CELLS_OCCUPIED = .4;

	// whether the game is separated into different colors or not
	var is_separated = false;

	// Determines which cells should be alive and which should be dead in the
	// next generation based on their neighbors.
	// Returns a LifeChanges object for the alive and dead coordinates.
	var get_life_changes = function () {
		if (DEBUG) {
			print("Generation " + generation_number);
		}
		
		// an array to hold the arrays for the live and dead coords of each type
		// [DEAD, A, B, C, D]
		var cells_in_next_state = [[], [], [], [], []];

		board.for_each_cell(function (coord) {
			// get the alive neighbors of the same type as the current cell

			if (is_cell_dead(coord)) { // cell is dead
				var alive_neighbor_types = get_alive_neighbor_types(coord);
				var average_type = Math.round(alive_neighbor_types.avg());
				if (alive_neighbor_types.length === 3) {
					// cell comes to life
					cells_in_next_state[average_type].push(coord);
				} else {
					// cell still dead
					cells_in_next_state[DEAD].push(coord);
				}

			} else { // cell is alive
				var num_neighbors = count_alive_neighbors_of_type(coord);
				var type = board.get_cell(coord);
				if ((num_neighbors === 2) || (num_neighbors === 3)) {
					// cell lives
					cells_in_next_state[type].push(coord);
				} else {
					// cell dies
					cells_in_next_state[DEAD].push(coord);
				}
			}
		});
		return cells_in_next_state;
	};

	// Takes a list of lists of dead and alive coords for the next generation and applies the changes to the baord
	var apply_life_changes = function (cells_in_next_state) {
		cells_in_next_state[DEAD].each(function (coord) {
			board.clear_cell(coord);
		});
		cells_in_next_state[ALIVE_A].each(function (coord) {
			board.set_cell(coord, ALIVE_A);
		});
		cells_in_next_state[ALIVE_B].each(function (coord) {
			board.set_cell(coord, ALIVE_B);
		});
		cells_in_next_state[ALIVE_C].each(function (coord) {
			board.set_cell(coord, ALIVE_C);
		});
		cells_in_next_state[ALIVE_D].each(function (coord) {
			board.set_cell(coord, ALIVE_D);
		});
	};

	// Counts the number of alive cells that touch the cell at coord based on two conditions:
	// 1. if the cell at coord is dead, counts any alive neighbors
	// 2. if the cell at coord is alive, counts only alive neighbors that have the same type
	var get_alive_neighbor_types = function (coord) {
		var type = board.get_cell(coord);
		var neighbors = board.get_neighbors(coord);
		var alive_neighbor_types = [];
		
		// add the neighbors that are alive of any type
		neighbors.each(function (neighborCoord) {
			if (!is_cell_dead(neighborCoord)) {
				alive_neighbor_types.push(board.get_cell(neighborCoord));
			}
		});
		return alive_neighbor_types;
	};

	// Counts the number of alive cells that touch the cell at coord based on two conditions:
	// 2. if the cell at coord is alive, counts only alive neighbors that have the same type
	var count_alive_neighbors_of_type = function (coord) {
		var type = board.get_cell(coord);
		var neighbors = board.get_neighbors(coord);
		var count = 0;
		if ( type === DEAD) {
			return 0;
		}
		
		// count the neighbors that are alive and of the same type
		neighbors.each(function (neighborCoord) {
			// count only alive neighbors of same type
			if (board.get_cell(neighborCoord) === type) {
				count++;
			}
		});
		return count;
	};

	// Returns true if the cell is dead, false otherwise
	var is_cell_dead = function (coord) {
		return board.get_cell(coord) === DEAD;
	}

	// the object to be returned that holds all of life's "public" functions
	var self = createObject(Life.prototype);

	// Returns an integer representing which quadrant the coord falls in
	// | 1 | 2 |
	// ---------
	// | 3 | 4 |
	var get_type_by_quadrant = function (coord) {
		// if the game is not separated, treat everything like quadrant 1
		if (!is_separated) {
			return ALIVE_A;
		}
		var r = coord.row;
		var c = coord.col;
		if (r < board.get_height()/2) { // upper half
			if (c < board.get_width()/2) {
				// upper left quadrant
				return ALIVE_A;
			} else {
				// upper right quadrant
				return ALIVE_B;
			}
		} else { // lower half
			if (c < board.get_width()/2) {
				// lower left quadrant
				return ALIVE_C;
			} else {
				// upper right quadrant
				return ALIVE_D;
			}
		}
	}

	// Get the next generation in the game of life and display it
	self.update = function () {
			generation_number++;
			life_changes = get_life_changes();
			apply_life_changes(life_changes);
			print(board.toString());
	};

	// Returns the number of the current generation (not thread-safe)
	self.get_current_generation_number = function () {
		return generation_number;
	};

	self.reset = function () {
		is_separated = false;
		board.clear();
	};

	self.randomize = function () {
		is_separated = false;
		print("Randomizing the life board");
		board.clear();
		board.for_each_cell(function (coord) {
			if ((Math.random() + DEFUALT_PERCENT_CELLS_OCCUPIED) >= 1) {
				board.set_cell(coord, ALIVE_A);
			}
		});
	};

	self.separate_by_quadrant = function () {
		is_separated = true;
		print("Separating the board by quadrants");
		board.clear();
		board.for_each_cell(function (coord) {
			if ((Math.random() + DEFUALT_PERCENT_CELLS_OCCUPIED) >= 1) {
				board.set_cell(coord, get_type_by_quadrant(coord));
			}
		});
	};

	self.set_alive = function (coord) {
		board.set_cell(coord, get_type_by_quadrant(coord));
	}

	// reveal some methods in debug mode only
	if (DEBUG) {
		self.get_life_changes = function () {
			return get_life_changes();
		};

		self.count_alive_neighbors_of_same_type = function (coord) {
			return count_alive_neighbors_of_same_type(coord);
		};
	}

	Object.freeze(self);
	return self;
};