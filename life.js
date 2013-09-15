// An abstraction for the rules of the game of life. Takes a Board object
// to play the game on.
var Life = function (board) {

	var generation_number = 0;

	// An abstraction for the status (alive/dead) changes between generations.
	// Simulates an innner class.
	var LifeChanges = function (alive_coords, dead_coords) {
		return {
			alive: alive_coords,
			dead: dead_coords};
	};

	var get_life_changes = function () {
		print("Generation " + generation_number);
		alive_coords = [];
		dead_coords = [];
		board.for_each_cell(function (coord) {
			var num_neighbors = board.count_occupied_neighbors(coord);
			if (board.is_cell_vacant(coord)) { // cell is dead
				if (num_neighbors === 3) {
					// cell comes to life
					// print("Cell " + coord + "is dead and lives");
					alive_coords.push(coord);
				} else {
					// cell still dead
					// print("Cell " + coord + "is dead and dies");
					dead_coords.push(coord);
				}
			} else { // cell is alive
				if ((num_neighbors === 2) || (num_neighbors === 3)) {
					// cell lives
					// print("Cell " + coord + "is alive and lives");
					alive_coords.push(coord);
				} else {
					// cell dies
					// print("Cell " + coord + "is alive and dies");
					dead_coords.push(coord);
				}
			}
		});
		return LifeChanges(alive_coords, dead_coords);
	};

	var apply_life_changes = function (life_changes) {
		life_changes.alive.each(function (coord) {
			board.add(coord);
		});
		life_changes.dead.each(function (coord) {
			board.remove(coord);
		});
	};


	// the object to be returned that holds all of life's "public" functions
	var self = {
		update: function () {
			generation_number++;
			life_changes = get_life_changes();
			board.clear();
			apply_life_changes(life_changes);
			// print(board.toString());
		}
	}
	return self;
};



(function () {
	// create the drawing pad object and associate with the canvas
	var UPDATE_INTERVAL = 1 * 1000; // 1 second

	var pad = Pad(document.getElementById('canvas'));
	pad.clear();

	board = Board(pad);
	board.clear();
	board.reset();

	life = Life(board);
	interval = setInterval(life.update, UPDATE_INTERVAL);
}) ();

