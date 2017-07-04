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
new JSFile(arrayBuffer, "Filename.ext")
    .save()
```

Download a file to the device:

``` javascript
JSFile.fromURL("http://my.com/file.pdf")
    .save()
```


## JSFileManager

### `JSFileManager.pick(options)`

Returns a promise to a JSFile object. You can pass an options object to the `pick()` function, with these fields:

Option		| Type				| Description
------------|-------------------|-----------------------
`event` 	| Browser event 	| If you call `pick()` from within a [trusted event] and pass in the event here, the system file picker will be shown immediately.
`dropzone`	| Boolean			| Defaults to `false`. If `true`, will show a drop zone overlay UI to allow the user to drop files on the browser window instead of selecting them with the picker.
`maxFiles`	| Integer			| Defaults to 1. If this is higher than 1, the result of the promise will be an array of JSFiles.


## JSFile

### `new JSFile(data, name)`

Creates a new JSFile, with the specified data and name.

Argument	| Type														| Description
------------|-----------------------------------------------------------|-----------------------
`data`		| TypedArray, ArrayBuffer, Blob, File, String, or Object	| The contents of the file. If you pass in a string, it will be saved with UTF8 encoding. If you pass in an object, it will be JSON-encoded as a string.
`name`		| String													| *(optional)* The name of the file.


### `JSFile.fromURL(url, name)`

Creates a new JSFile, with the contents of the specified URL.

Argument	| Type		| Description
------------|-----------|-----------------------
`url`		| String	| The URL to the file. The file's contents are only downloaded when requested (ie. using `file.getArrayBuffer()` etc)
`name`		| String	| *(optional)* The name of the file.


### `file.name`

The file's name.


### `file.type`

The file's mimetype.


### `file.size`

The file's size, if available, or else 0.


### `file.lastModifiedDate`

The file's last modified date if available, or else the date the JSFile's data was last updated.


### `file.save()`

Saves the file. Returns a Promise once completed.

> NOTE: On some browsers, this needs to be called from within a [trusted event].


### `file.setData(data)`

Update the file's data. The data won't be written to the file until you call `save()`. This is the same as `new JSFile(data)`, but reuses the same file object.


### `file.getArrayBuffer()`

Retrieves the file's contents as an [ArrayBuffer]. Returns a [Promise].


### `file.getBlob()`

Retrieves the file's contents as a [Blob]. Returns a [Promise].


### `file.getString()`

Retrieves the file's contents as a string. Returns a [Promise].


### `file.getJSON()`

Retrieves the file's contents as a JSON object. Returns a [Promise].


### `file.getDataURL()`

Retrieves the file's contents as a [data URL], which can be displayed in an `<img/>` or other tag. The contents of the file are Base64 encoded into the URL, so this should not be used for large files. Returns a [Promise].


### `file.getObjectURL()`

Retrieves an [Object URL] pointing to this file's content. This is similar to `getDataURL()`, except the URL doesn't contain the actual data, just a pointer to it, so it works with files of any size.
The URL is only valid in the context of the running web app. Returns a [Promise].



[ArrayBuffer]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
[Blob]: https://developer.mozilla.org/en/docs/Web/API/Blob
[data URL]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
[Object URL]: https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
[Promise]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
[trusted event]: https://developer.mozilla.org/en/docs/Web/API/Event/isTrusted
