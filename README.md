# JSFileManager

This package makes it easier to work with files in the browser. It allows users to open files by using the standard file picker dialog, or via a drop zone. It also allows saving data to file using the standard Save As dialog.

**Features:**

- Unified file interface for working with file data
- Open files via the browser's Open dialog
- Open files by allowing the user to drop them onto the browser window
- Save files using the browser's Save As dialog
- Create files using any type of data (ArrayBuffer, Blob, String, etc)

## Using this package

To use this package, if you're using a packager like webpack, you can import it:

``` javascript
// ES6 import style
import JSFileManager, { JSFile } from 'js-file-manager'

// CommonJS style
var JSFileManager = require("js-file-manager");
var JSFile = JSFileManager.JSFile;
```

... or else you can just include it using the script tag:

``` html
<script src="https://npmcdn.com/js-file-manager/dist/jsfilemanager.min.js"></script>
```

## Examples

See all tests [here](https://rawgit.com/jjv360/js-file-manager/master/tests.html).

Open a file using the browser's Open dialog and read it as an array buffer:

``` javascript
JSFileManager.pick({ event: touchOrClickBrowserEvent })
    .then(file => file.getArrayBuffer())
	.then(arrayBuffer => ...)
```

Pick multiple files with a drop zone:

``` javascript
JSFileManager.pick({ dropzone: true, maxFiles: 999 })
    .then(files => ...)
```

Save an ArrayBuffer as a file on the device:

``` javascript
new JSFile(arrayBuffer, "Filename.ext").save({ event: touchOrClickBrowserEvent})
```


## JSFileManager

### `JSFileManager.pick(options)`

Returns a promise to a JSFile object. You can pass an options object to the `pick()` function, with these fields:

Option		| Type				| Description
------------|-------------------|-----------------------
`event` 	| Browser event 	| If you call `pick()` from within a [trusted event](https://developer.mozilla.org/en/docs/Web/API/Event/isTrusted) and pass in the event here, the system file picker will be shown immediately.
`dropzone`	| Boolean			| Defaults to `false`. If `true`, will show a drop zone overlay UI to allow the user to drop files on the browser window instead of selecting them with the picker.
`maxFiles`	| Integer			| Defaults to 1. If this is higher than 1, the result of the promise will be an array of JSFiles.


## JSFile

### `new JSFile(data, name)`

Creates a new JSFile, with the specified data and name.

Argument	| Type														| Description
------------|-----------------------------------------------------------|-----------------------
`data`		| TypedArray, ArrayBuffer, Blob, File, String, or Object	| The contents of the file. If you pass in a string, it will be saved with UTF8 encoding. If you pass in an object, it will be JSON-encoded as a string.
`name`		| String													| *(optional)* The name of the file.



### `JSFile.save(options)`

Saves the file. Returns a Promise once completed. The options is an object with these fields:

Option		| Type				| Description
------------|-------------------|-----------------------
`event` 	| Browser event 	| If you call `save()` from within a [trusted event](https://developer.mozilla.org/en/docs/Web/API/Event/isTrusted) and pass in the event here, the system file save dialog will be shown immediately.


### `JSFile.setData(data)`

Update the file's data. The data won't be written to the file until you call `save()`. This is the same as `new JSFile(data)`, but reuses the same file object.
