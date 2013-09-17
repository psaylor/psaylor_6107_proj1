module("board module", {
	setup: function () {
		DEBUG = true;
		var canvas = document.createElement('canvas');
		var canvasSize = 400;
		canvas.width = canvasSize;
		canvas.height = canvasSize;
		pad = Pad(canvas);
	}
});

test("testing board creation", function() {
	var boardSize = 5;
	var board = Board(pad, boardSize, boardSize);
	ok((board instanceof Board), "object returned an instance of Board");

	board.for_each_cell(function (coord) {
		ok((board.is_cell_vacant(coord) === true), "Cell vacant");
	}); 

	ok(board.get_height() === boardSize, "Board has proper height");
	ok(board.get_width() === boardSize, "Board has proper width");

});

test("testing board add/remove", function () {
	var board = Board(pad, 5, 5);
	// adding outside range of board shouldn't change the board
	var coord1 = Coord(2, 5);
	var coord2 = Coord(10, 10);
	var coord3 = Coord(-1, 3);
	var coord4 = Coord(-3, -2);

	board.add(coord1);
	board.add(coord2);
	board.add(coord3);
	board.add(coord4);

	board.for_each_cell(function (coord) {
		ok((board.is_cell_vacant(coord) === true), "Cell vacant");
	});

	// adding within range should make it occupied
	board.for_each_cell(function (coord) {
		board.add(coord);
		ok((board.is_cell_occupied(coord)) === true, "Cell occupied")
	});

	// removing outside range shouldn't change the board
	board.remove(coord1);
	board.remove(coord2);
	board.remove(coord3);
	board.remove(coord4);

	board.for_each_cell(function (coord) {
		ok((board.is_cell_occupied(coord) === true), "Cell occupied");
	});

	// removing within range should make it vacant
	board.for_each_cell(function (coord) {
		board.remove(coord);
		ok((board.is_cell_vacant(coord)) === true, "Cell vacant")
	});
});

test("testing get_coords_of_all_occupied_cells", function () {
	var boardSize = 5;
	var board = Board(pad, boardSize, boardSize);
	var occupiedCoordsExpected = [];

	// set the diagonal to be occupied
	from_to(0, boardSize - 1, function (i) {
		var coord = Coord(i, i);
		board.add(coord);
		occupiedCoordsExpected.push(coord);
	});

	// get the occupied cells
	var occupied = board.get_coords_of_all_occupied_cells();

	from_to(0, occupiedCoordsExpected.length - 1, function (i) {
		var coord = occupiedCoordsExpected[i];
		var contained = false;
		from_to(0, occupied.length - 1, function (j) {
			var coord2 = occupied[j];
			if (coord.equals(coord2)) {
				contained = true;
			}
		});
		ok(contained, "Expected coordinate returned in occupied list");
	});

	// check that all actually occupied
	occupied.each(function (coord) {
		ok(board.is_cell_occupied(coord) === true, "Returned cell occupied");
	});
});

test("testing count_occupied_neighbors", function () {
	var boardSize = 2;
	var board = Board(pad, boardSize, boardSize);

	// verify no neighbors at beginning
	board.for_each_cell(function (coord) {
		var n = board.count_occupied_neighbors(coord);
		ok(n === 0, "Coordinate has no neighbors");
	});

	// set the whole board to be occupied
	board.for_each_cell(function (coord) {
		board.add(coord);
	});

	// verify each has 3 neighbors now
	board.for_each_cell(function (coord) {
		var n = board.count_occupied_neighbors(coord);
		ok(n === 3, "Coordinate has 3 neighbors");
	});

	var removedCoord = Coord(0,0);
	board.remove(removedCoord);

	// verify neighbors now
	board.for_each_cell(function (coord) {
		var n = board.count_occupied_neighbors(coord);
		if (coord.equals(removedCoord)) {
			ok(n === 3, "Coordinate has 3 neighbors");
		} else {
			ok(n === 2, "Coordinate has 3 neighbors");
		}		
	});
});

test("testing board clear/reset", function () {
	var boardSize = 6;
	var board = Board(pad, boardSize, boardSize);

	board.for_each_cell(function (coord) {
		board.add(coord);
	});

	board.clear();

	board.for_each_cell(function (coord) {
		ok(board.is_cell_vacant(coord) === true, "Cell succesfuly cleared");
	})

	board.reset();

	var count = 0;
	board.for_each_cell(function (coord) {
		if (board.is_cell_occupied(coord)) {
			count++;
		}
	});

	ok(count > 0, "Reset added some initial state"); 
	// (this could fail with some very small probability)
})

module("life module", {
	setup: function () {
		DEBUG = true;
		var canvas = document.createElement('canvas');
		var canvasSize = 400;
		canvas.width = canvasSize;
		canvas.height = canvasSize;
		pad = Pad(canvas);
	}
});

test("testing life next generation", function () {
	var boardSize = 4;
	board = Board(pad, boardSize, boardSize);
	var life = Life(board);

	// make a square of alive cells
	board.clear();
	var aliveCoords = [Coord(1, 1), Coord(1, 2), Coord(2, 1), Coord(2, 2)];
	aliveCoords.each(function (coord) {
		board.add(coord);
	});

	// verify the life changes have the right size
	var lifeChanges = life.get_life_changes();
	ok(lifeChanges.alive.length === 4, "Should be 4 alive cells");
	ok(lifeChanges.dead.length === 12, "Should be 12 dead cells");
	life.update(); // updates the state of the board with the life changes

	// verify each alive cell still alive
	aliveCoords.each(function (coord) {
		ok(board.is_cell_occupied(coord) === true, "Cell still alive");
	});

	// and verify the other cells are still dead
	ok(board.get_coords_of_all_occupied_cells().length === 4, "Only 4 cells alive");
});

test("testing life next generation again", function () {
	var boardSize = 3;
	board = Board(pad, boardSize, boardSize);
	var life = Life(board);

	// make all cells alive
	board.for_each_cell(function (coord) {
		board.add(coord);
	});

	life.update(); // updates the state of the board with the life changes

	// after update, only corners should be alive
	board.for_each_cell(function (coord) {
		// check corner alive
		if ((coord.y === 0) || (coord.y === boardSize -1)) {
			if ((coord.x === 0) || (coord.x === boardSize -1)) {
				// corner cell
				ok(board.is_cell_occupied(coord) === true, "Corner cell alive");
			} else {
				// non corner
				ok(board.is_cell_vacant(coord) === true, "Non-corner cell dead");
			}
		} else {
			// not a corner- should be dead
			ok(board.is_cell_vacant(coord) === true, "Non-corner cell dead");
		}
	});

});