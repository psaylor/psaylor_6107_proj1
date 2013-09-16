// An abstraction for the rules of the game of life. Takes a Board object
// to play the game on.
var Life = function (board) {

	var generation_number = 0;

	// An abstraction for the status (alive/dead) changes between generations.
	// Simulates an innner class.
	var LifeChanges = function (alive_coords, dead_coords) {
		var self = createObject(LifeChanges.prototype);
		self.alive = alive_coords;
		self.dead = dead_coords;
		Object.freeze(self);
		return self;
	};

	// Determines which cells should be alive and which should be dead in the
	// next generation based on their neighbors.
	// Returns a LifeChanges object for the alive and dead coordinates.
	var get_life_changes = function () {
		print("Generation " + generation_number);
		alive_coords = [];
		dead_coords = [];
		board.for_each_cell(function (coord) {
			var num_neighbors = board.count_occupied_neighbors(coord);
			if (board.is_cell_vacant(coord)) { // cell is dead
				if (num_neighbors === 3) {
					// cell comes to life
					alive_coords.push(coord);
				} else {
					// cell still dead
					dead_coords.push(coord);
				}
			} else { // cell is alive
				if ((num_neighbors === 2) || (num_neighbors === 3)) {
					// cell lives
					alive_coords.push(coord);
				} else {
					// cell dies
					dead_coords.push(coord);
				}
			}
		});
		return LifeChanges(alive_coords, dead_coords);
	};

	// Takes a LifeChanges object and applies the changes to the baord
	var apply_life_changes = function (life_changes) {
		if (life_changes instanceof LifeChanges) {
			life_changes.alive.each(function (coord) {
				board.add(coord);
			});
			life_changes.dead.each(function (coord) {
				board.remove(coord);
			});
		} else {
			printError("Provided argument was not an instance of LifeChanges");
		}	
	};


	// the object to be returned that holds all of life's "public" functions
	var self = createObject(Life.prototype);

	// Get the next generation in the game of life and display it
	self.update = function () {
			generation_number++;
			life_changes = get_life_changes();
			apply_life_changes(life_changes);
			// print(board.toString());
	};

	Object.freeze(self);
	return self;
};



(function () {
	
	var UPDATE_INTERVAL = 1 * 1000; // 1 second

	// create the drawing pad object and associate with the canvas
	var pad = Pad(document.getElementById('canvas'));
	pad.clear();

	// create the board object and get an initial state
	board = Board(pad); // (global on purpose for convenience)
	board.reset();

	// create the life object
	life = Life(board); // (global on purpose for convenience)

	// update life every UPDATE_INTERVAL ms
	var interval = window.setInterval(life.update, UPDATE_INTERVAL);

	// Stop the game of life at the current generation
	// (global on purpose for convenience)
	stopLife = function () {
		window.clearInterval(interval);
	};

	// Resume the game of life from the current generation
	// (global on purpose for convenience)
	resumeLife = function () {
		interval = window.setInterval(life.update, UPDATE_INTERVAL);
	};

}) ();

