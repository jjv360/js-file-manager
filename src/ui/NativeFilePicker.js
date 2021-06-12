//
// Pick a file using the native file picker

var JSFile = require("../JSFile")

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

			// Only accept specific file formats
			if (opts.accept != null && typeof opts.accept == 'string') {
				NativeElement.accept = opts.accept;
			}

			// Add it
			document.body.appendChild(NativeElement);

		}

		// Set multiple option
		NativeElement.multiple = opts.maxFiles > 1;
		NativeElement.value = "";

		// Return promise
		return new Promise((onSuccess, onFail) => {

			// Set handler
			NativeElement.onchange = e => {

				// Create array of files
				var itms = [];
				for (var i = 0 ; i < Math.min(NativeElement.files.length, opts.maxFiles) ; i++)
					itms.push(new JSFile(NativeElement.files[i]));

				onSuccess(itms);

			}

			// Trigger it
			NativeElement.click();

		});

	}

}
