//
// Represents a single file

const UTF8 = require("utf-8")
const saveAs = require("file-saver").saveAs

module.exports = class JSFile {

	constructor(data, name) {

		// Properties
		this.name = "File"
		this.type = "application/octet-stream"
		this.size = 0
		this.lastModified = Date.now()
		this.lastModifiedDate = new Date()

		/** @private This contains the actual data for the file, or a link to it. This will only ever be an ArrayBuffer, a Blob, or a File.  */
		this.fileData = null

		// Store data
		this.setData(data);

		// Update name
		if (name)
			this.name = name;

	}

	/** Set the file's data. It won't be saved to disk until you call the save() function. */
	setData(data) {

		// Check input data type
		if (!data) {

			// No data provided
			this.fileData = new ArrayBuffer(0);

		} else if (typeof File != "undefined" && data instanceof File) {

			// Store info
			this.name = data.name
			this.type = data.type || "application/octet-stream"
			this.size = data.size
			this.fileData = data
			this.lastModified = data.lastModified || this.lastModified
			this.lastModifiedDate = data.lastModifiedDate || this.lastModifiedDate

		} else if (typeof Blob != "undefined" && data instanceof Blob) {

			// Store info
			this.type = data.type || "application/octet-stream"
			this.size = data.size
			this.fileData = data

		} else if (typeof ArrayBuffer != "undefined" && data instanceof ArrayBuffer) {

			// Store info
			this.size = data.byteLength
			this.fileData = data

		} else if (typeof ArrayBuffer != "undefined" && data.buffer instanceof ArrayBuffer) {

			// Store info
			this.size = data.buffer.byteLength
			this.fileData = data.buffer

		} else if (typeof data == "string") {

			// UTF-8 encode string
			var bytes = new Uint8Array(UTF8.setBytesFromString(data));
			this.size = bytes.buffer.byteLength
			this.type = "text/plain; charset=utf-8"
			this.fileData = bytes.buffer

		} else if (typeof data == "object") {

			// JSON encode object
			var bytes = new Uint8Array(UTF8.setBytesFromString(JSON.stringify(data)));
			this.size = bytes.buffer.byteLength
			this.type = "text/plain; charset=utf-8"
			this.fileData = bytes.buffer

		} else {

			// Unknown data type
			throw new Error("JSFile constructor needs data, but instead received " + data)

		}

	}

	/** Read file data as an ArrayBuffer */
	getArrayBuffer() {

		// Check if already got an array buffer
		if (this.fileData instanceof ArrayBuffer)
			return Promise.resolve(this.fileData);

		// Create promise
		return new Promise((onSuccess, onFail) => {

			// Read the file data
			var reader = new FileReader();
			reader.onload = e => onSuccess(reader.result);
			reader.onerror = onFail;
			reader.readAsArrayBuffer(this.fileData);

		});

	}

	/** Read file data as a Blob */
	getBlob() {

		// Check if already got an array buffer
		if (this.fileData instanceof ArrayBuffer)
			return Promise.resolve(new Blob([this.fileData], { type: this.type }));

		// Data is already a blob (or blob compatible)
		return Promise.resolve(this.fileData);

	}

	/** Read string */
	getString() {

		// Check if got an array buffer
		if (this.fileData instanceof ArrayBuffer) {

			// Decode arraybuffer
			var bfr = new Uint8Array(this.fileData);
			return Promise.resolve(UTF8.getStringFromBytes(bfr));

		}

		// Create promise
		return new Promise((onSuccess, onFail) => {

			// Read the file data
			var reader = new FileReader();
			reader.onload = e => onSuccess(reader.result);
			reader.onerror = onFail;
			reader.readAsText(this.fileData);

		});

	}

	/** Read JSON object */
	getJSON() {
		return this.getString().then(JSON.parse);
	}

	/** Read as a data URL */
	getDataURL() {

		// Create promise
		return new Promise((onSuccess, onFail) => {

			// Get Blob to read
			var blob = this.fileData instanceof ArrayBuffer ? new Blob([this.fileData]) : this.fileData;

			// Read the file data
			var reader = new FileReader();
			reader.onload = e => onSuccess(reader.result);
			reader.onerror = onFail;
			reader.readAsDataURL(blob);

		});

	}

	/** Read as a Blob (object) URL */
	getObjectURL() {

		// Get blob, convert to object URL
		return this.getBlob().then(blob => URL.createObjectURL(blob))

	}

	/** Save file */
	save(opts) {

		// Check if we can show the native UI immediately
		if (!opts || !opts.event || !opts.event.isTrusted)
			// return Promise.reject(new Error("You must call this within a trusted event, and pass it as the event option."));
			console.warn("JSFile.save() called without a trusted event! The file may not save.");

		// Show save UI
		return this.getBlob().then(blob => {

			// Show UI
			saveAs(blob, this.name);
			return this;

		})

	}

}
