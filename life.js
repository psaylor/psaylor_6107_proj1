// An abstraction for the rules of the game of life. Takes a Board object
// to play the game on.
var Life = function (board) {

	var generation_number = 0;

	// the 5 different types of cells in the board
	var DEAD = 0;
	var ALIVE_A = 1;
	var ALIVE_B = 2;
	var ALIVE_C = 3;
	var ALIVE_D = 4;
	// use ALIVE_A  as the default cell type in the normal version of the game
	var ALIVE_DEFAULT = ALIVE_A;

	// (approximately) what fraction of cells should be alive in the random initial state
	var DEFUALT_PERCENT_CELLS_OCCUPIED = .4;

	// A simulated enum of the different versions of the game
	// 0 is for the normal version of the GOL
	// 1 is for the 'peace' version
	// 2 is for the 'war' version
	var GAME_TYPE = {
		NORMAL: 0,
		PEACE: 1,
		WAR: 2,
	};
	// start in the peaceful version by default
	var current_game_type = GAME_TYPE.PEACE; 

	// Determines which cells should be alive and which should be dead in the
	// next generation based on the normal rules of the game of life
	// Returns an array to hold the arrays for the live and dead coords of each type of the format [DEAD, A, B, C, D]
	var get_life_changes_normal = function () {
		if (DEBUG) {
			print("Get life changes normal... Generation " + generation_number);
		}
		
		// an array to hold the arrays for the live and dead coords of each type
		// [DEAD, A, B, C, D]
		var cells_in_next_state = [[], [], [], [], []];

		board.for_each_cell(function (coord) {
			// sum the neighbors who are alive
			var num_alive = count_neighbors_by_type(coord).slice(1).sum();
			var type = board.get_cell(coord);

			if (is_cell_dead(coord)) { // cell is dead
				if (num_alive === 3) {
					// cell comes to life
					cells_in_next_state[ALIVE_DEFAULT].push(coord);
				} else {
					// cell still dead
					cells_in_next_state[DEAD].push(coord);
				}

			} else { // cell is alive
				
				if ((num_alive === 2) || (num_alive === 3)) {
					// cell lives
					cells_in_next_state[ALIVE_DEFAULT].push(coord);
				} else {
					// cell dies
					cells_in_next_state[DEAD].push(coord);
				}
			}
		});
		return cells_in_next_state;
	};

	// Determines which cells should be alive and which should be dead in the
	// next generation based on the war rules of the game of life
	// Returns an array to hold the arrays for the live and dead coords of each type of the format [DEAD, A, B, C, D]
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
					var new_type = num_neighbors_by_type.slice(1).indexOfMax() + 1;
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

	// Determines which cells should be alive and which should be dead in the
	// next generation based on the peace rules of the game of life
	// Returns an array to hold the arrays for the live and dead coords of each type of the format [DEAD, A, B, C, D]
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
					var new_type = (num_neighbors_by_type.weightedSum() % 4) + 1;
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


	// Takes a list of lists of dead and alive coords of each type for the next generation and applies the changes to the baord
	var apply_life_changes = function (cells_in_next_state) {
		cells_in_next_state[DEAD].each(function (coord) {
			board.set_cell(coord, DEAD);
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

	// Returns the type of cell that should be assigned to a coord based on the quadrant the coord is in, for use in War and Peace versions.
	// The qudrants are broken down as follows:
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
	};

	// Sets each live cell to the type corresponding to its quadrant
	// Used when changing game states
	var update_types_by_quadrant = function () {
		board.for_each_cell(function (coord) {
			if (!is_cell_dead(coord)) {
				board.set_cell(coord, get_type_by_quadrant(coord));
			}
		});
	};

	// Sets each live cell to the default type
	// Used when changing game states
	var update_types_to_default = function () {
		board.for_each_cell(function (coord) {
			if (!is_cell_dead(coord)) {
				board.set_cell(coord, ALIVE_DEFAULT);
			}
		});
	};

	// the object to be returned that holds all of life's "public" functions
	var self = createObject(Life.prototype);


	// Get the next generation in the game of life and update the board
	self.update = function () {
		generation_number++;
		var life_changes;
		if (current_game_type === GAME_TYPE.NORMAL) {
			life_changes = get_life_changes_normal();

		} else if (current_game_type === GAME_TYPE.PEACE) {
			life_changes = get_life_changes_peace();

		} else if (current_game_type === GAME_TYPE.WAR) {
			life_changes = get_life_changes_war();

		} else {
			printError("Invalid game type " + String(current_game_type));
			life_changes = get_life_changes_normal();
		}
		apply_life_changes(life_changes);
	};

	// Clears the current generation from the board
	self.clear = function () {
		board.for_each_cell(function (coord) {
			board.set_cell(coord, DEAD);
		});
	};

	// Clears the current generation from the board and resets to a random initial state.
	// The types of the live cells are based on the current game rules being used-
	// If not normal, a live cell will take the type corresponding to the quadrant it is in.
	self.reset_random = function () {
		self.clear();
		if (current_game_type === GAME_TYPE.NORMAL) {
			board.for_each_cell(function (coord) {
				if ((Math.random() + DEFUALT_PERCENT_CELLS_OCCUPIED) >= 1) {
					board.set_cell(coord, ALIVE_DEFAULT);
				} else {
					board.set_cell(coord, DEAD);
				}
			});
		} else {
			board.for_each_cell(function (coord) {
				if ((Math.random() + DEFUALT_PERCENT_CELLS_OCCUPIED) >= 1) {
					board.set_cell(coord, get_type_by_quadrant(coord));
				} else {
					board.set_cell(coord, DEAD);
				}
			});
		}
	};

	// Sets the game to the normal version of the Game of Life and updates the cell 
	// Updates the colors if the rules were not normal before
	self.set_game_rules_normal = function () {
		if (!(current_game_type === GAME_TYPE.NORMAL)) {
			current_game_type = GAME_TYPE.NORMAL;
			update_types_to_default();
		}
	};

	// Sets the game to the war version of the Game of Life and updates the cell types
	// Updates the colors if the rules were normal before
	self.set_game_rules_war = function () {
		if (current_game_type === GAME_TYPE.NORMAL) {
			update_types_by_quadrant();
		}
		current_game_type = GAME_TYPE.WAR;
	};

	// Sets the game to the peace version of the Game of Life and updates the cell types
	// Updates the colors if the rules were normal before
	self.set_game_rules_peace = function () {
		if (current_game_type === GAME_TYPE.NORMAL) {
			update_types_by_quadrant();
		}
		current_game_type = GAME_TYPE.PEACE;
	};

	// Sets the cell at coord to be alive. The type of the live cell is based on the current game rules being used. If not normal, the cell will take the type corresponding to the quadrant it is in.
	self.set_alive = function (coord) {
		if (current_game_type === GAME_TYPE.NORMAL) {
			board.set_cell(coord, ALIVE_A);
		} else {
			board.set_cell(coord, get_type_by_quadrant(coord));
		}
	};

	// reveal some methods in debug mode only
	if (DEBUG) {
		self.get_life_changes_normal = function () {
			return get_life_changes_normal();
		};

		self.get_life_changes_peace = function () {
			return get_life_changes_peace();
		};

		self.get_life_changes_war = function () {
			return get_life_changes_war();
		};

		self.count_neighbors_by_type = function (coord) {
			return count_neighbors_by_type(coord);
		};

		self.get_type_by_quadrant = function (coord) {
			return get_type_by_quadrant(coord);
		};
	}

	Object.freeze(self);
	self.clear();
	return self;
};