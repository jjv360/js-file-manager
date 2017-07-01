//
// Index file for the webpack build.

module.exports = {};
module.exports.JSFileManager = require("./JSFileManager");
module.exports.JSFile = require("./JSFile");

// Export each individual class to the global window object
if (typeof window != "undefined") {
	for (var name in module.exports) {
		if (module.exports.hasOwnProperty(name)) {
			window[name] = module.exports[name];
		}
	}
}
