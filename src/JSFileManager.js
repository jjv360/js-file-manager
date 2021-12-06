//
// This class provides functions for displaying picker UI.

var NativeFilePicker = require("./ui/NativeFilePicker")
var FilePicker = require("./ui/FilePicker");

module.exports = class JSFileManager {

	/**
	 * Picks a file.
	 * @param {object} opts Configurable options.
	 * @param {number} opts.maxFiles Maximum number of files to select. Default is 1.
	 * @param {boolean} opts.dropzone `true` to show a drop zone overlay, allowing the user to drop files instead of selecting them. Default is `false`.
	 * @param {string} opts.accept Comma-separated list of file types, or unique file type specifiers, to allow. See https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept for more information.
	 * @param {Event} opts.event Browser event.
	 */
	static pick(opts = {}) {

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
