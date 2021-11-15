//
// Shows the file picker UI

var JSFile = require("../JSFile")
var NativeFilePicker = require("./NativeFilePicker")
var bytes = require('bytes');

module.exports = class FilePicker {

	/** Pick some files */
	static showPicker(opts) {

		// Create instance
		var i = new FilePicker(opts);

		// Create promise
		return new Promise((onSuccess, onFail) => {
			i.oncancel = e => onSuccess([]);
			i.onpick = onSuccess;
		});

	}

	constructor(opts) {

		// Properties
		this.options = opts;
		this.files = [];

		// Events
		this.oncancel = null;
		this.onpick = null;

		// Create container div
		this.div = document.createElement("div");
		this.div.style.cssText = "display: flex; position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 99999; background-color: rgba(0, 0, 0, 0.1); justify-content: center; align-items: center; ";
		this.div.addEventListener("dragenter", this.onDragEnter.bind(this), false);
		this.div.addEventListener("dragover", this.onDragOver.bind(this), false);
		this.div.addEventListener("drop", this.onDrop.bind(this), false);
		document.body.appendChild(this.div);

		// Create window
		var win = document.createElement("div");
		win.style.cssText = "display: inline-block; position: relative; width: 50%; height: 50%; background-color: rgba(240, 240, 240, 0.9); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); border-radius: 3px; overflow: hidden; box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.2); ";
		this.div.appendChild(win);

		// Create scrollable area
		this.fileList = document.createElement("div");
		this.fileList.style.cssText = "display: block; position: absolute; top: 0px; left: 0px; width: 100%; height: calc(100% - 40px); overflow-x: hidden; overflow-y: auto; -webkit-scrolling: touch; ";
		win.appendChild(this.fileList);

		// Create button area
		var buttons = document.createElement("div");
		buttons.style.cssText = "display: flex; justify-content: flex-start; align-items: center; position: absolute; bottom: 0px; left: 0px; width: 100%; height: 40px; background-color: rgba(128, 128, 128, 0.1); ";
		win.appendChild(buttons);

		// Create pick button
		var pickBtn = document.createElement("div");
		pickBtn.style.cssText = "display: inline-block; padding: 10px 20px; font-family: Helvetica, Arial; font-size: 15px; color: #08F; cursor: pointer; ";
		pickBtn.innerText = this.options.maxFiles == 1 ? "Open File" : "Open Files";
		pickBtn.addEventListener("click", this.doNativePick.bind(this));
		pickBtn.addEventListener("touchdown", this.doNativePick.bind(this));
		buttons.appendChild(pickBtn);

		// Create spacer
		var spacer = document.createElement("div");
		spacer.style.cssText = "flex-shrink: 1; flex-grow: 1; ";
		buttons.appendChild(spacer);

		// Create cancel button
		var cancelBtn = document.createElement("div");
		cancelBtn.style.cssText = "display: inline-block; padding: 10px 20px; font-family: Helvetica, Arial; font-size: 15px; color: #08F; cursor: pointer; ";
		cancelBtn.innerText = "Cancel";
		cancelBtn.addEventListener("click", this.close.bind(this));
		cancelBtn.addEventListener("touchdown", this.close.bind(this));
		buttons.appendChild(cancelBtn);

		// Create done button
		var doneBtn = document.createElement("div");
		doneBtn.style.cssText = "display: inline-block; padding: 10px 20px; font-family: Helvetica, Arial; font-size: 15px; font-weight: bold; color: #08F; cursor: pointer; ";
		doneBtn.innerText = "Done";
		doneBtn.addEventListener("click", this.done.bind(this));
		doneBtn.addEventListener("touchdown", this.done.bind(this));
		buttons.appendChild(doneBtn);

		// Refresh files
		this.refreshUI();

	}

	/** Update the file list */
	refreshUI() {

		// Remove all contents of file list
		while (this.fileList.children[0])
			this.fileList.removeChild(this.fileList.children[0]);

		// Add placeholder if needed
		if (this.files.length == 0) {

			// Add container
			var container = document.createElement("div");
			container.style.cssText = "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: stretch; ";
			this.fileList.appendChild(container);

			// Add drop info
			var elem = document.createElement("div");
			elem.style.cssText = "display: inline-block; width: 100%; height: 100px; background-size: 64px 64px; opacity: 0.25; background-repeat: no-repeat; background-position: center; background-image: url(" + require("./FilePicker.drop.svg") + "); ";
			container.appendChild(elem);

			var elem2 = document.createElement("div");
			elem2.style.cssText = "display: block; font-family: Helvetica, Arial; font-size: 17px; color: rgba(0, 0, 0, 0.5); text-align: center; user-select: none;";
			elem2.innerHTML = this.options.maxFiles == 1 ? "Drop a file here" : "Drop files here";
			container.appendChild(elem2);

		}

		// Add each file entry
		for (let file of this.files) {

			// Create row
			var row = document.createElement("div");
			row.style.cssText = "display: flex; align-items: center; height: 44px; ";
			this.fileList.appendChild(row);

			// Create icon
			var icon = require("./FilePicker.iconFile.svg");
			var iconDiv = document.createElement("div");
			iconDiv.style.cssText = "width: 44px; height: 100%; background-size: 24px 24px; background-repeat: no-repeat; background-position: center; background-image: url(" + icon + "); ";
			row.appendChild(iconDiv);

			// Create text area
			var textArea = document.createElement("div");
			textArea.style.cssText = "flex-grow: 1; flex-shrink: 1; ";
			row.appendChild(textArea);

			// Create file name
			var text1 = document.createElement("div");
			text1.style.cssText = "display: block; font-family: Helvetica, Arial; font-size: 13px; font-weight: bold; color: #000; text-align: left; padding-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ";
			text1.innerText = file.name;
			textArea.appendChild(text1);

			// Create file size
			var text2 = document.createElement("div");
			text2.style.cssText = "display: block; font-family: Helvetica, Arial; font-size: 11px; color: #888; text-align: left; ";
			text2.innerText = bytes(file.size, {unitSeparator: " "});
			textArea.appendChild(text2);

		}

	}

	/** Do native pick action */
	doNativePick(e) {
		e.preventDefault();

		// Do it
		NativeFilePicker.showPicker(this.options).then(files => {

			// Add files
			for (var file of files)
				this.files.push(file);

			// Done
			this.refreshUI();

			// If we only need one file, pick immediately
			if (this.options.maxFiles == 1)
				this.done();

		})

	}

	/** Close */
	close(e) {
		e && e.preventDefault();

		// Remove UI
		document.body.removeChild(this.div);

		// Send cancel
		if (this.oncancel)
			this.oncancel();

	}

	/** Done */
	done(e) {
		e && e.preventDefault();

		// Remove UI
		document.body.removeChild(this.div);

		// Send done
		if (this.onpick)
			this.onpick(this.files);

	}

	onDragEnter(e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = "copy";
		e.dataTransfer.effectAllowed = "copy";
	}

	onDragOver(e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = "copy";
		e.dataTransfer.effectAllowed = "copy";
	}

	onDrop(e) {
		e.stopPropagation();
		e.preventDefault();

		// Add files
		for (var i = 0 ; i < e.dataTransfer.files.length ; i++)
			this.files.push(new JSFile(e.dataTransfer.files[i]));

		// Done
		this.refreshUI();

		// If we only need one file, pick immediately
		if (this.options.maxFiles == 1)
			this.done();

	}

}
