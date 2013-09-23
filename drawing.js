// An abstraction for a visible grid built of DOM elements
// An optional height and width may be provided (defaults to DEFAULT_HEIGHT
// and DEFAULT_WIDTH otherwise), which determines the number of cells in the grid.
// Allows you to set one of four different colors on a given cell, or to set no color.
var DrawableGrid = function (height, width) {

	var DEFAULT_HEIGHT = 40;
	var DEFAULT_WIDTH = 40;

	var COLOR_CLASSES = ["muted-red", "muted-blue", "green", "yellow"];

	// use the default values if 
	// 1. height or width is undefined
	// 2. height or width is the wrong type
	if ((height === undefined) || (!isNumber(height))) {
		height = DEFAULT_HEIGHT;
	}
	if ((width === undefined) || (!isNumber(width))) {
		width = DEFAULT_WIDTH;
	}

	var cell_click_listeners = [];

	// Creates a new id string to be set for the id attribute of the cell at row r, column c
	var create_id = function (r, c) {
		return "Cell" + String(r) + "-" + String(c);
	};

	// Returns the cell at row r, column c in the grid
	var get_cell_by_id = function (r, c) {
		var id = "#" + create_id(r, c);
		var cell = $(id);
		return $(id);
	};

	// Creates a new cell to be placed at row r, column c in the grid
	// Sets its classes, attributes, and onClick listeners
	var create_cell = function (r, c) {
		var cell = $("<td>")
					.addClass("cell")
					.attr("id", create_id(r,c));
		cell.click( function (event) {
			if (DEBUG) {
				print("Clicked Cell " + r + ", " + c );
			}
			cell_click_listeners.each( function (listener) {
				listener(Coord(c, r));
			});
			}
		);
		return cell;
	};

	// Creates the DOM elements for table, rows, and cells, and adds it to the HTML
	// NOTE: Must have an HTML element with id="board_container"
	var create_grid = function () {
		print("Creating the grid for the board");
		var table = $("<table>");
		table.addClass("table table-bordered");

		for (var r = 0; r < height; r++) {
			var row = $("<tr>");
			table.append(row);

			for (var c = 0; c < width; c++) {
				var cell = create_cell(r, c);
				row.append(cell);
			}
		}

		$("#board_container").append(table);
	}; 
	
	create_grid();

	// the object to be returned that holds all of draw's "public" functions
	var self = createObject(Life.prototype);

	// Takes a Coord object in terms of the grid's coordinate system and
	// puts a colored at the corresponding location on the grid
	// The value parameter should be between 1 and 4 inclusive, and selects
	// a color for the cell from the 4 available colors.
	self.draw_colored_cell = function (coord, value) {
		var cell = get_cell_by_id(coord.row, coord.col);

		if ((value > 0) && (value <= COLOR_CLASSES.length)) {
			// first remove the other classes
			COLOR_CLASSES.each( function (occ_class) {
				cell.removeClass(occ_class);
			});
			// then add the appropriate class
			cell.addClass(COLOR_CLASSES[value-1]);
		} else {
			printError("Value " + value + " is out of range");
		}
	};

	// Takes a Coord object in terms of the board's coordinate system and
	// puts a vacant at the corresponding location on the grid
	self.draw_clear_cell = function (coord) {
		var cell = get_cell_by_id(coord.row, coord.col);
		COLOR_CLASSES.each( function (occ_class) {
			cell.removeClass(occ_class);
		});
	};

	// Clears the grid.
	self.draw_empty_grid = function () {
		var all_cells = $("td.cell");
		COLOR_CLASSES.each( function (occ_class) {
			all_cells.removeClass(occ_class);
		});
	};

	// Register a listener function to be called whenever a cell in the grid
	// is clicked. The listener should accept a coord as a parameter
	self.register_cell_click_listener = function (listener) {
		cell_click_listeners.push(listener);
	};

	Object.freeze(self);
	return self;
};



