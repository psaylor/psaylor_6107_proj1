/* METHODS FOR DRAWING ON THE PAD */

var draw = function () {
			

	// the color of an occupied cell on the pad (green)
	var OCCUPIED_COLOR = Color(48, 131, 48);
	// the color of a vacant cell on the pad (black)
	var VACANT_COLOR = Color(0, 0, 0); 
	var BOARD_COLOR = Color(0, 0, 0); // black
	var LINE_WIDTH = 1;
	var BOARD_MARGIN = 1;

};

	// Takes a Coord object in terms of the board's coordinate system and
	// returns a Coord object in terms of the pad's coordinate system
	var board_to_pad_coords = function (coord) {
		var x = coord.col * cell_width;
		var y = coord.row * cell_height;
		return Coord(x, y);
	};

	// Takes a Coord object in terms of the board's coordinate system and
	// draws an occupied at the corresponding location on the pad
	// Does not mutate board_state.
	var draw_occupied_cell = function (coord) {
		pad_coord = board_to_pad_coords(coord);
		pad.draw_rectangle(pad_coord, cell_height, cell_width, LINE_WIDTH, BOARD_COLOR, 
			OCCUPIED_COLOR);
	};

	// Takes a Coord object in terms of the board's coordinate system and
	// draws a vacant at the corresponding location on the pad
	// Does not mutate board_state.
	var draw_vacant_cell = function (coord) {
		pad_coord = board_to_pad_coords(coord);
		pad.draw_rectangle(pad_coord, cell_height, cell_width, LINE_WIDTH, BOARD_COLOR, 
			VACANT_COLOR);
	};

	// Clears the pad. Does not mutate board_state.
	var draw_empty_board = function () {
		pad.clear();
		pad.draw_rectangle(Coord(0, 0), pad.get_width(), pad.get_height(), 
			BOARD_MARGIN, BOARD_COLOR, BOARD_COLOR);
	};

	// Redraws the whole pad based on the current board_state. Does not mutate board_state.
	var redraw_board = function () {
		draw_empty_board();
		occupied_cells = self.get_coords_of_all_occupied_cells();
		occupied_cells.each(function (coord) {
			draw_occupied_cell(coord);
		});
	};

		// // Randomly sets each cell to either occupied or vacant according to DEFUALT_PERCENT_CELLS_OCCUPIED 
	// var set_random_initial_state = function () {
	// 	self.for_each_cell(function (coord) {
	// 		if ((Math.random() + DEFUALT_PERCENT_CELLS_OCCUPIED) >= 1) {
	// 			set_cell(coord, OCCUPIED);
	// 		} else {
	// 			set_cell(coord, VACANT);
	// 		}
	// 	});
	// 	if (DEBUG) {
	// 		check_rep_invariants();
	// 	}
	// };


	var cell_height = pad.get_height() / height;
	var cell_width = pad.get_width() / width;	

