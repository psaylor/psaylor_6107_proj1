// BOARD TESTS
module("board module", {
	setup: function () {
		DEBUG = true;
		EMPTY_CELL = undefined;
	}
});

test("testing board creation", function() {
	var boardSize = 5;
	var board = Board(boardSize, boardSize);
	ok((board instanceof Board), "object returned an instance of Board");

	board.for_each_cell(function (coord) {
		ok((board.get_cell(coord) === EMPTY_CELL), "Cell vacant");
	}); 

	ok(board.get_height() === boardSize, "Board has proper height");
	ok(board.get_width() === boardSize, "Board has proper width");

});

test("testing board add/remove", function () {
	var board = Board(5, 5);
	// adding outside range of board shouldn't change the board
	var coord1 = Coord(2, 5);
	var coord2 = Coord(10, 10);
	var coord3 = Coord(-1, 3);
	var coord4 = Coord(-3, -2);

	var value = 1;

	board.set_cell(coord1, value);
	board.set_cell(coord2, value);
	board.set_cell(coord3, value);
	board.set_cell(coord4, value);

	board.for_each_cell(function (coord) {
		ok((board.get_cell(coord) === EMPTY_CELL), "Cell vacant");
	});

	// adding within range should make it occupied
	board.for_each_cell(function (coord) {
		board.set_cell(coord, value);
		ok((board.get_cell(coord)) === value, "Cell occupied")
	});

	// clearing outside range shouldn't change the board
	board.clear_cell(coord1);
	board.clear_cell(coord2);
	board.clear_cell(coord3);
	board.clear_cell(coord4);

	board.for_each_cell(function (coord) {
		ok((board.get_cell(coord) === value), "Cell occupied");
	});

	// clearing within range should make it vacant
	board.for_each_cell(function (coord) {
		board.clear_cell(coord);
		ok((board.get_cell(coord)) === EMPTY_CELL, "Cell vacant")
	});
});

test("testing board clear", function () {
	var boardSize = 6;
	var board = Board(boardSize, boardSize);

	var value = 1;
	board.for_each_cell(function (coord) {
		board.set_cell(coord, value);
	});

	board.clear();

	board.for_each_cell(function (coord) {
		ok(board.get_cell(coord) === EMPTY_CELL, "Cell succesfuly cleared");
	})
});

test("testing board register set listeners", function () {
	var boardSize = 2;
	var board = Board(boardSize, boardSize);

	var f = function (coord) {
		ok(true, "Listener function called");
	};

	board.register_listener_on_set(f);
	var coord1 = Coord(0,0);
	board.set_cell(coord1, 1);
});

test("testing board register clear listeners", function () {
	var boardSize = 2;
	var board = Board(boardSize, boardSize);

	var f = function (coord) {
		ok(true, "Listener function called");
	};

	board.register_listener_on_clear(f);
	board.clear();
});

// LIFE TESTS
module("life module", {
	setup: function () {
		DEBUG = true;
		// the 5 different types of cells in the board from life.js
		DEAD = 0;
		ALIVE_A = 1;
		ALIVE_B = 2;
		ALIVE_C = 3;
		ALIVE_D = 4;
		ALIVE_DEFAULT = ALIVE_A;
	}
});

test("testing count_neighbors_by_type", function () {
	var boardSize = 2;
	var board = Board(boardSize, boardSize);
	var life = Life(board);

	// verify no live neighbors at beginning
	board.for_each_cell(function (coord) {
		var num_neighbors_by_type = life.count_neighbors_by_type(coord);
		ok(num_neighbors_by_type[DEAD] === 3, "Coordinate has no neighbors");
		ok(num_neighbors_by_type[ALIVE_A] === 0, "Coordinate has no neighbors of type A");
		ok(num_neighbors_by_type[ALIVE_B] === 0, "Coordinate has no neighbors of type B");
		ok(num_neighbors_by_type[ALIVE_C] === 0, "Coordinate has no neighbors of type C");
		ok(num_neighbors_by_type[ALIVE_D] === 0, "Coordinate has no neighbors of type D");
	});

	var coord1 = Coord(0, 0);
	var coord2 = Coord(0, 1);
	var coord3 = Coord(1, 0);
	var coord4 = Coord(1, 1);
	// set the whole board to be occupied by different types
	board.set_cell(coord1, ALIVE_A);
	board.set_cell(coord2, ALIVE_B);
	board.set_cell(coord3, ALIVE_C);
	board.set_cell(coord4, ALIVE_D);


	// verify each has 3 neighbors now, one of each type
	board.for_each_cell(function (coord) {
		var num_neighbors_by_type = life.count_neighbors_by_type(coord);
		var num_alive = num_neighbors_by_type.slice(1).sum();
		ok(num_alive === 3, "Coordinate has 3 live neighbors");
		ok(num_neighbors_by_type[DEAD] === 0, "Coordinate has no dead neighbors");
		ok((num_neighbors_by_type[ALIVE_A] === 0 || num_neighbors_by_type[ALIVE_A] === 1), "Coordinate has 0 or 1 neighbors of type A");
		ok((num_neighbors_by_type[ALIVE_B] === 0 || num_neighbors_by_type[ALIVE_B] === 1), "Coordinate has 0 or 1 neighbors of type B");
		ok((num_neighbors_by_type[ALIVE_C] === 0 || num_neighbors_by_type[ALIVE_C] === 1), "Coordinate has 0 or 1 neighbors of type C");
		ok((num_neighbors_by_type[ALIVE_D] === 0 || num_neighbors_by_type[ALIVE_D] === 1), "Coordinate has 0 or 1 neighbors of type D");
	});

	var removedCoord = Coord(0,0);
	board.set_cell(removedCoord, DEAD);

	// verify neighbors now
	board.for_each_cell(function (coord) {
		var num_neighbors_by_type = life.count_neighbors_by_type(coord);
		var num_alive = num_neighbors_by_type.slice(1).sum();
		if (coord.equals(removedCoord)) {
			ok(num_alive === 3, "Coordinate has 3 neighbors");
		} else {
			ok(num_alive === 2, "Coordinate has 3 neighbors");
		}		
	});
});

test("testing life next generation for normal rules", function () {
	var boardSize = 4;
	board = Board(boardSize, boardSize);
	var life = Life(board);

	life.set_game_rules_normal();
	// make a square of alive cells
	var aliveCoords = [Coord(1, 1), Coord(1, 2), Coord(2, 1), Coord(2, 2)];
	aliveCoords.each(function (coord) {
		board.set_cell(coord, ALIVE_DEFAULT);
	});

	// verify the life changes have the right size
	var cells_in_next_state = life.get_life_changes_normal();
	ok(cells_in_next_state[ALIVE_DEFAULT].length === 4, "Should be 4 alive cells");
	ok(cells_in_next_state[DEAD].length === 12, "Should be 12 dead cells");
	life.update(); // updates the state of the board with the life changes

	// verify each alive cell still alive
	aliveCoords.each(function (coord) {
		ok(board.get_cell(coord) === ALIVE_DEFAULT, "Cell still alive");
	});

	// and verify the other cells are still dead
	var count_alive = 0;
	board.for_each_cell(function (coord) {
		if (board.get_cell(coord) === ALIVE_DEFAULT) {
			count_alive++;
		}
	});
	ok(count_alive === 4, "Only 4 cells alive");
});

test("testing life next generation for peace rules", function () {
	var boardSize = 4;
	board = Board(boardSize, boardSize);
	var life = Life(board);

	// make a square of alive cells
	life.clear();
	life.set_game_rules_peace();

	var coord1 = Coord(1, 1);
	var coord2 = Coord(1, 2);
	var coord3 = Coord(2, 1);
	var coord4 = Coord(2, 2);

	// set each of the above coords to a different alive type
	board.set_cell(coord1, ALIVE_A);
	board.set_cell(coord2, ALIVE_B);
	board.set_cell(coord3, ALIVE_C);
	board.set_cell(coord4, ALIVE_D);

	// verify the life changes have the right size
	var cells_in_next_state = life.get_life_changes_peace();
	ok(cells_in_next_state[ALIVE_A].length === 1, "Should be 1 alive cell of A");
	ok(cells_in_next_state[ALIVE_B].length === 1, "Should be 1 alive cell of B");
	ok(cells_in_next_state[ALIVE_C].length === 1, "Should be 1 alive cell of C");
	ok(cells_in_next_state[ALIVE_D].length === 1, "Should be 1 alive cell of D");
	ok(cells_in_next_state[DEAD].length === 12, "Should be 12 dead cells");
	life.update(); // updates the state of the board with the life changes

	// verify each alive cell still alive
	ok(board.get_cell(coord1) === ALIVE_A, "Cell still alive");
	ok(board.get_cell(coord2) === ALIVE_B, "Cell still alive");
	ok(board.get_cell(coord3) === ALIVE_C, "Cell still alive");
	ok(board.get_cell(coord4) === ALIVE_D, "Cell still alive");

	// and verify the other cells are still dead
	var count_alive = 0;
	board.for_each_cell(function (coord) {
		if (!(board.get_cell(coord) === DEAD)) {
			count_alive++;
		}
	});
	ok(count_alive === 4, "Only 4 cells alive");
});

test("testing life next generation for war rules", function () {
	var boardSize = 4;
	board = Board(boardSize, boardSize);
	var life = Life(board);
	life.set_game_rules_war();

	// make a square of alive cells
	var coord1 = Coord(1, 1);
	var coord2 = Coord(1, 2);
	var coord3 = Coord(2, 1);
	var coord4 = Coord(2, 2);

	// set each of the above coords to a different alive type
	board.set_cell(coord1, ALIVE_A);
	board.set_cell(coord2, ALIVE_B);
	board.set_cell(coord3, ALIVE_C);
	board.set_cell(coord4, ALIVE_D);

	// verify the life changes have the right size
	var cells_in_next_state = life.get_life_changes_war();
	// ok(cells_in_next_state[ALIVE_DEFAULT].length === 4, "Should be 4 alive cells");
	ok(cells_in_next_state[DEAD].length === 16, "Should be 16 dead cells");
	life.update(); // updates the state of the board with the life changes

	// and verify all cells dead now
	board.for_each_cell(function (coord) {
		ok(board.get_cell(coord) === DEAD, "Cell dead now");
	});
});

test("testing life next generation again", function () {
	var boardSize = 3;
	board = Board(boardSize, boardSize);
	var life = Life(board);

	// make all cells alive
	board.for_each_cell(function (coord) {
		board.set_cell(coord, ALIVE_DEFAULT);
	});

	life.update(); // updates the state of the board with the life changes

	// after update, only corners should be alive
	board.for_each_cell(function (coord) {
		// check corner alive
		if ((coord.y === 0) || (coord.y === boardSize -1)) {
			if ((coord.x === 0) || (coord.x === boardSize -1)) {
				// corner cell
				ok(board.get_cell(coord) === ALIVE_DEFAULT, "Corner cell alive");
			} else {
				// non corner
				ok(board.get_cell(coord) === DEAD, "Non-corner cell dead");
			}
		} else {
			// not a corner- should be dead
			ok(board.get_cell(coord) === DEAD, "Non-corner cell dead");
		}
	});

});