/* 1D Iterators */
// Calls f(i) for from <= i <= to
var from_to = function (from, to, f) {
	if (from > to) return;
	f(from);
	from_to(from + 1, to, f);
};

// Calls f(i) for from <= i <= to, but quits as soon as
// an f(i) returns false (like a break statement in a for loop)
var from_to_quick_escape = function (from, to, f) {
	if (from > to) return;
	// quit if applying the function returned false
	if (f(from) === false) {
		return;
	}
	from_to(from + 1, to, f);
};

/* 2D Iterators */
// Calls f(i,j) for each pair of numbers in the specified range
// from_i <= i <= to_i and from_j <= j <= to_j
var from_to_2D = function (from_i, to_i, from_j, to_j, f) {
	if (from_i > to_i) return;
	from_to(from_j, to_j, function (j) {
		f(from_i, j);
	});
	from_to_2D(from_i + 1, to_i, from_j, to_j, f);
};

// Calls f(i,j) for each pair of numbers in the specified range
// from_i <= i <= to_i and from_j <= j <= to_j
// but quits as soon as f(i,j) returns false 
// (like a break statement in a for loop)
var from_to_2D_quick_escape = function (from_i, to_i, from_j, to_j, f) {
	if (from_i > to_i) return;
	from_to_quick_escape(from_j, to_j, function (j) {
		f(from_i, j);
	});
	from_to_2D_quick_escape(from_i + 1, to_i, from_j, to_j, f);
};

// Add a for each iterator to the arrays
Array.prototype.each = function (f) {
	var that = this;
	from_to(0, that.length - 1, function (i) {
		f(that[i]);
	});
};

/* Print Utilities */
var print = function (msg) {
	console.log(msg);
};

var printError = function (errorMsg) {
	console.error(errorMsg);
};

var printWarning = function (warningMsg) {
	console.warn(warningMsg);
};

/* Number testing and comparison utils */
(function () {
	var NUMBER_TYPE = "number";

	// Global method to check if n is a number
	isNumber = function (n) {
		return typeof(n) === NUMBER_TYPE;
	};

	// Global method to check if a < b and both are numbers
	lessThan = function (a, b) {
		if (isNumber(a) && isNumber(b)) {
			return a < b;
		}
		printWarning("Compared non-numbers " + String(a) + " and " + String(b));
		return a < b;
	};

	// Global method to check if a <= b and both are numbers
	lessThanEqualTo = function (a, b) {
		if (isNumber(a) && isNumber(b)) {
			return a <= b;
		}
		printWarning("Compared non-numbers " + String(a) + " and " + String(b));
		return a <= b;
	};
	return;
})();

// same as Object.create in ECMAScript 5
// return a fresh object whose prototype is o
// note: borrowed from 6.170 example code for Set.js
var createObject = function (o) {
	var F = function () {}
	F.prototype = o;
	return new F();
};
