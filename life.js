// An abstraction for the rules of the game of life. Takes a Board object
// to play the game on.
var Life = function (board) {

	var generation_number = 0;

	var CELL_TYPE = {
		DEAD: 0,
		ALIVE_A: 1,
		ALIVE_B: 2,
		ALIVE_C: 3, 
		ALIVE_D: 4,

		num_alive_types: 4,
	};

	var DEAD = 0;
	var ALIVE_A = 1;
	var ALIVE_B = 2;
	var ALIVE_C = 3;
	var ALIVE_D = 4;

	// (approximately) what fraction of cells should be alive in the random initial state
	var DEFUALT_PERCENT_CELLS_OCCUPIED = .4;

	// A list of the different types of the game
	// 0 is for the normal version of the GOL
	// 1 is for the 'peace' version
	// 2 is for the 'war' version
	var GAME_TYPE = {
		NORMAL: 0,
		PEACE: 1,
		WAR: 2,
	};
	var current_game_type = GAME_TYPE.PEACE; // start in the peaceful version by default

	// Determines which cells should be alive and which should be dead in the
	// next generation based on their neighbors.
	// Returns an object for the alive and dead coordinates.
	var get_life_changes_normal = function () {
		if (DEBUG) {
			print("Get life changes normal... Generation " + generation_number);
		}
		
		// an array to hold the arrays for the live and dead coords of each type
		// [DEAD, A, B, C, D]
		var cells_in_next_state = [[], [], [], [], []];

		board.for_each_cell(function (coord) {
			// in the normal game, only want to consider neighbors of type A
			// and should only have neighbors of type A anyways
			var num_neighbors = count_neighbors_by_type(coord)[ALIVE_A];
			var type = board.get_cell(coord);

			if (is_cell_dead(coord)) { // cell is dead
				if (num_neighbors === 3) {
					// cell comes to life
					cells_in_next_state[ALIVE_A].push(coord);
				} else {
					// cell still dead
					cells_in_next_state[DEAD].push(coord);
				}

			} else { // cell is alive
				
				if ((num_neighbors === 2) || (num_neighbors === 3)) {
					// cell lives
					cells_in_next_state[ALIVE_A].push(coord);
				} else {
					// cell dies
					cells_in_next_state[DEAD].push(coord);
				}
			}
		});
		return cells_in_next_state;
	};

	var get_life_changes_war = function () {
		if (DEBUG) {
			print("Get life changes war...Generation " + generation_number);
		}
		
		// an array to hold the arrays for the live and dead coords of each type
		// [DEAD, A, B, C, D]
		var cells_in_next_state = [[], [], [], [], []];
		
		board.for_each_cell(function (coord) {
			var num_neighbors_by_type = count_neighbors_by_type(coord);
			var type = board.get_cell(coord);
			var num_alive = num_neighbors_by_type.slice(1).sum();

			if (is_cell_dead(coord)) { // cell is dead
				if (num_alive === 3) {
					// cell comes to life
					var new_type = num_neighbors_by_type.slice(1).indexOfMax();
					cells_in_next_state[new_type].push(coord);
				} else {
					// cell still dead
					cells_in_next_state[DEAD].push(coord);
				}

			} else { // cell is alive
				var num_alive_same_type = num_neighbors_by_type[type];
				if ((num_alive_same_type === 2) || (num_alive_same_type === 3)) {
					var num_alive_diff_type = num_alive - num_alive_same_type;
					if (num_alive_diff_type >= 4) {
						// cell dies if outnumbered
						cells_in_next_state[DEAD].push(coord);
					} else {
						// cell lives as same type
						cells_in_next_state[type].push(coord);
					}
				} else {
					// cell dies
					cells_in_next_state[DEAD].push(coord);
				}
			}
		});
		return cells_in_next_state;
	};

	var get_life_changes_peace = function () {
		if (DEBUG) {
			print("Get life changes peace...Generation " + generation_number);
		}
		
		// an array to hold the arrays for the live and dead coords of each type
		// [DEAD, A, B, C, D]
		var cells_in_next_state = [[], [], [], [], []];

		board.for_each_cell(function (coord) {
			var num_neighbors_by_type = count_neighbors_by_type(coord);
			var type = board.get_cell(coord);
			var num_alive = num_neighbors_by_type.slice(1).sum();

			if (is_cell_dead(coord)) { // cell is dead
				if (num_alive === 3) {
					// cell comes to life
					// get the new type as some function of the live types around it
					// use the sum of the types %4 +1 so that any of the 4 types can be generated
					var new_type = (num_neighbors_by_type.weighted_sum() % 4) + 1;
					cells_in_next_state[new_type].push(coord);
				} else {
					// cell still dead
					cells_in_next_state[DEAD].push(coord);
				}

			} else { // cell is alive
				
				if ((num_alive === 2) || (num_alive === 3)) {
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

	// Counts the number of alive cells that touch the cell at coord of each type
	// Returns a list of counts of each type
	var count_neighbors_by_type = function (coord) {
		var type = board.get_cell(coord);
		
		var neighbors = board.get_neighbors(coord);
		// num neighbors of each type [DEAD, ALIVE_A, ALIVE_B, ALIVE_C, ALIVE_D]
		var num_neighbors_of_type = [0, 0, 0, 0, 0];
		
		// count the neighbors that are alive and of the same type
		neighbors.each(function (neighborCoord) {
			// count only alive neighbors of same type
			var neighborType = board.get_cell(neighborCoord);
			num_neighbors_of_type[neighborType]+= 1;			
		});
		return num_neighbors_of_type;
	};

	// Returns true if the cell is dead, false otherwise
	var is_cell_dead = function (coord) {
		return board.get_cell(coord) === DEAD;
	}

	// the object to be returned that holds all of life's "public" functions
	var self = createObject(Life.prototype);

	// Returns an integer representing which quadrant the coord falls in
	// For use in Separated mode
	// | 1 | 2 |
	// ---------
	// | 3 | 4 |
	var get_type_by_quadrant = function (coord) {
		// if the game is not separated, treat everything like quadrant 1
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
			var life_changes;
			if (!is_separated) {
				life_changes = get_life_changes_normal();
			} else {
				life_changes = get_life_changes_peace();
			}
			apply_life_changes(life_changes);
			// print(board.toString());
	};

	self.clear = function () {
		board.clear();
	};

	self.reset_random = function () {
		self.clear();
		if (current_game_type === GAME_TYPE.NORMAL) {
			board.for_each_cell(function (coord) {
				if ((Math.random() + DEFUALT_PERCENT_CELLS_OCCUPIED) >= 1) {
					board.set_cell(coord, ALIVE_A);
				}
			});
		} else {
			board.for_each_cell(function (coord) {
				if ((Math.random() + DEFUALT_PERCENT_CELLS_OCCUPIED) >= 1) {
					board.set_cell(coord, get_type_by_quadrant(coord);
				}
			});
		}
		
	};

	self.set_game_type_normal = function () {
		current_game_type = GAME_TYPE.NORMAL;

	};

	self.set_game_type_war = function () {
		current_game_type = GAME_TYPE.WAR;
	};

	self.set_game_type_peace = function () {
		current_game_type = GAME_TYPE.PEACE;
	};

	self.set_alive = function (coord) {
		if (current_game_type === GAME_TYPE.NORMAL) {
			board.set_cell(coord, ALIVE_A);
		} else {
			board.set_cell(coord, get_type_by_quadrant(coord));
		}
	};

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