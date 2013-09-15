// An abstraction for the rules of the game of life. Takes a Board object
// to play the game on.
var Life = function (board) {

	var get_next_generation = function () {

		board.for_each_cell(function (coord) {
			var num_neighbors = board.count_occupied_neighbors(coord);
			if (board.is_cell_vacant(coord)) {
				if (num_neighbors === 3) {
					// live
				} else {
					// die
				}
			} else {
				if (2<= num_neighbors <=3) {
					// live
				} else {
					// die
				}
			}
			
		});

	};

	// the object to be returned that holds all of life's "public" functions
	var self = {

	}
	return self;
};



(function () {
	// create the drawing pad object and associate with the canvas
	pad = Pad(document.getElementById('canvas'));
	pad.clear();

	board = Board(pad);
	board.clear();
	board.reset();
}) ();

