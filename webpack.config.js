
//
// WebPack config file

var webpack = require('webpack');

module.exports = {
    plugins: [],
    module: {
        loaders: []
    },
    externals: []
};

// The app's starting file
module.exports.entry = "./src/index-webpack.js";

// The final app's JS output file
module.exports.output = {
    path: __dirname + "/dist/",
    filename: "jsfilemanager.min.js",
    libraryTarget:"var"
};

// Output a sourcemap
module.exports.devtool = "source-map";

// Compile support for ES6 classes and React etc
module.exports.module.loaders.push({
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    query: {
        presets: ["es2015"]
    }
});


// Compile support for images and other media.
module.exports.module.loaders.push({
    test: /\.(svg|png|gif|jpg)$/,
    loader: "url-loader",
	options: {
		limit: 1024*1024*16
	}
});
