from_to = function (from, to, f) {
	if (from > to) return;
	f(from);
	from_to(from + 1, to, f);
}

from_to_quick_escape = function (from, to, f) {
	if (from > to) return;
	// quit if applying the function returned false
	if (f(from) === false) {
		return;
	}
	from_to(from + 1, to, f);
}

// calls f(i,j) for each pair of numbers in the specified range
from_to_2D = function (from_i, to_i, from_j, to_j, f) {
	if (from_i > to_i) return;
	from_to(from_j, to_j, function (j) {
		f(from_i, j);
	});
	from_to_2D(from_i + 1, to_i, from_j, to_j, f);
}

from_to_2D_quick_escape = function (from_i, to_i, from_j, to_j, f) {
	if (from_i > to_i) return;
	from_to_quick_escape(from_j, to_j, function (j) {
		f(from_i, j);
	});
	from_to_2D(from_i + 1, to_i, from_j, to_j, f);
}

Array.prototype.each = function (f) {
	var that = this;
	from_to(0, that.length - 1, function (i) {
		f(that[i]);
	});
}

print = function (msg) {
	console.log(msg);
}

printError = function (errorMsg) {
	console.error(errorMsg);
}


// testing utils
var testUtils = function () {
	var NUMBER_TYPE = "number";

	isNumber = function (n) {
		return typeof(n) === NUMBER_TYPE;
	}

	// global method
	lessThan = function (a, b) {
		if (isNumber(a) && isNumber(b)) {
			return a < b;
		}
		return false;
	}

	lessThanEqualTo = function (a, b) {
		if (isNumber(a) && isNumber(b)) {
			return a <= b;
		}
		return false;
	}
}();


