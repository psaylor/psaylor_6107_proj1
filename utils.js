from_to = function (from, to, f) {
	if (from > to) return;
	f(from);
	from_to(from + 1, to, f);
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


