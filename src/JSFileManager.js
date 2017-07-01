//
// This class provides functions for displaying picker UI.

var NativeFilePicker = require("./ui/NativeFilePicker")
var FilePicker = require("./ui/FilePicker");

module.exports = class JSFileManager {

	/** Pick a file */
	static pick(opts) {

		// Set default options
		opts.maxFiles = opts.maxFiles || 1;
		opts.event = opts.event || (typeof window == "undefined" ? null : window.event);

		// Check if we can display the native file picker
		if (!opts.dropzone && opts.event && opts.event.isTrusted) {

			// We can, show it
			return NativeFilePicker.showPicker(opts).then(files => {
				return opts.maxFiles == 1 ? files[0] : files;
			});

		} else {

			// We can't, create our own picker interface
			return FilePicker.showPicker(opts).then(files => {
				return opts.maxFiles == 1 ? files[0] : files;
			});

		}

	}

}
