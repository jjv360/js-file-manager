//
// Represents a single file

const UTF8 = require("utf-8")
const saveAs = require("file-saver").saveAs
const axios = require("axios")
const base64 = require("base64-arraybuffer")

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

		/** @private If the file's data is located at a remote URL, this is that URL. */
		this.fileURL = null

		// Store data
		this.setData(data);

		// Update name
		if (name)
			this.name = name;

	}

	/** Create a file from a remote URL */
	static fromURL(url, name) {

		// Specal case: Data URLs
		if (url.substring(0, 5).toLowerCase() == "data:") {

			// Strip scheme
			url = url.substring(5)

			// Get mimetype index
			var idx = url.indexOf(",")
			if (idx == -1)
				throw new Error("Invalid data: URL")

			// Get mimetype
			var type = url.substring(0, idx) || "text/plain;charset=US-ASCII"
			var data = url.substring(idx + 1)

			// Check if base64 encoded
			if (type.substring(type.length - 7).toLowerCase() == ";base64") {

				// Remove base64 from type
				type = type.substring(0, type.length - 7)

				// Decode data
				data = base64.decode(data)

			}

			// Create file from data
			var file = new JSFile(data, name)
			file.type = type
			return file

		}

		// Get last URL component as file name
		var urlname = url
		var idx = urlname.lastIndexOf("/")
		if (idx != -1) urlname = urlname.substring(idx+1)
		idx = urlname.lastIndexOf("\\")
		if (idx != -1) urlname = urlname.substring(idx+1)
		idx = urlname.indexOf("?")
		if (idx != -1) urlname = urlname.substring(0, idx)

		// Create file
		var file = new JSFile(null, name || urlname)
		file.fileData = null
		file.fileURL = url
		return file

	}

	/** @private Makes sure the file's contents have been downloaded, if necessary. Will set fileData to a blob. Returns a promise. */
	download() {

		// Check if we have file data already, or no URL to download from
		if (this.fileData || !this.fileURL)
			return Promise.resolve(this)

		// Send request, store result blob
		return axios.get(this.fileURL, { responseType: 'blob' }).then(response => this.setData(response.data))

	}

	/** Set the file's data. It won't be saved to disk until you call the save() function. */
	setData(data) {

		// Check input data type
		if (!data) {

			// No data provided
			this.fileData = new ArrayBuffer(0);
			this.size = 0
			this.lastModified = Date.now()
			this.lastModifiedDate = new Date()

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
			this.lastModified = Date.now()
			this.lastModifiedDate = new Date()

		} else if (typeof ArrayBuffer != "undefined" && data instanceof ArrayBuffer) {

			// Store info
			this.size = data.byteLength
			this.fileData = data
			this.lastModified = Date.now()
			this.lastModifiedDate = new Date()

		} else if (typeof ArrayBuffer != "undefined" && data.buffer instanceof ArrayBuffer) {

			// Store info
			this.size = data.buffer.byteLength
			this.fileData = data.buffer
			this.lastModified = Date.now()
			this.lastModifiedDate = new Date()

		} else if (typeof data == "string") {

			// UTF-8 encode string
			var bytes = new Uint8Array(UTF8.setBytesFromString(data));
			this.size = bytes.buffer.byteLength
			this.type = "text/plain; charset=utf-8"
			this.fileData = bytes.buffer
			this.lastModified = Date.now()
			this.lastModifiedDate = new Date()

		} else if (typeof data == "object") {

			// JSON encode object
			var bytes = new Uint8Array(UTF8.setBytesFromString(JSON.stringify(data)));
			this.size = bytes.buffer.byteLength
			this.type = "text/plain; charset=utf-8"
			this.fileData = bytes.buffer
			this.lastModified = Date.now()
			this.lastModifiedDate = new Date()

		} else {

			// Unknown data type
			throw new Error("JSFile.setData() needs data, but instead received " + data)

		}

		// Done
		return this

	}

	/** Read file data as an ArrayBuffer */
	getArrayBuffer() {

		// Check if already got an array buffer
		if (this.fileData instanceof ArrayBuffer)
			return Promise.resolve(this.fileData);

		// Create promise
		return this.download().then(e => new Promise((onSuccess, onFail) => {

			// Read the file data
			var reader = new FileReader();
			reader.onload = e => onSuccess(reader.result);
			reader.onerror = onFail;
			reader.readAsArrayBuffer(this.fileData);

		}));

	}

	/** Read file data as a Blob */
	getBlob() {

		// Check if already got an array buffer
		if (this.fileData instanceof ArrayBuffer)
			return Promise.resolve(new Blob([this.fileData], { type: this.type }));

		// Data is already a blob (or blob compatible)
		return this.download().then(e => this.fileData)

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
		return this.download().then(e => new Promise((onSuccess, onFail) => {

			// Read the file data
			var reader = new FileReader();
			reader.onload = e => onSuccess(reader.result);
			reader.onerror = onFail;
			reader.readAsText(this.fileData);

		}))

	}

	/** Read JSON object */
	getJSON() {
		return this.getString().then(JSON.parse);
	}

	/** Read as a data URL */
	getDataURL() {

		// Create promise
		return this.getBlob().then(blob => new Promise((onSuccess, onFail) => {

			// Read the file data
			var reader = new FileReader();
			reader.onload = e => onSuccess(reader.result);
			reader.onerror = onFail;
			reader.readAsDataURL(blob);

		}))

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
