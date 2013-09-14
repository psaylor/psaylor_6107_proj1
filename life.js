var Life = function (board) {

};

// constructor for the games rules
var Rule = function() {

};


(function () {
	// create the drawing pad object and associate with the canvas
	pad = Pad(document.getElementById('canvas'));
	pad.clear();

	board = Board(pad);
	board.clear();
	board.reset();
}) ();

