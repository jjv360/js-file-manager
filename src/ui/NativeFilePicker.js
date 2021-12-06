//
// Pick a file using the native file picker

var JSFile = require("../JSFile")

/**
 * Native file input element.
 * @type HTMLInputElement
 */
var NativeElement = null;

module.exports = class NativeFilePicker {

	/** Pick immediately. Must be called from within a trusted browser event. returns promise of array of JSFiles. */
	static showPicker(opts) {

		// Create element if needed
		if (!NativeElement) {

			// Create it
			NativeElement = document.createElement("input");
			NativeElement.type = "file";
			NativeElement.style.display = "none";

			// Accept only specific file types or default to accept anything
			NativeElement.accept = opts.accept != null && typeof opts.accept == "string" ? opts.accept : "*"

			// Add it
			document.body.appendChild(NativeElement);

		}

		// Update based on given options
		NativeElement.multiple = opts.maxFiles > 1;
		NativeElement.accept = opts.accept != null && typeof opts.accept == "string" ? opts.accept : "*"
		NativeElement.value = "";

		// Return promise
		return new Promise((onSuccess, onFail) => {

			// Set handler
			NativeElement.onchange = e => {

				// Create array of files
				var itms = [];
				for (var i = 0; i < Math.min(NativeElement.files.length, opts.maxFiles); i++)
					itms.push(new JSFile(NativeElement.files[i]));

				onSuccess(itms);

			}

			// Trigger it
			NativeElement.click();

		});

	}

}
