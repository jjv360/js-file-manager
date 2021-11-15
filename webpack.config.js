//
// Webpack config file

const path = require('path')

module.exports = {

    // Use production mode
    mode: "production",

    // Entry file
    entry: {
        main: path.resolve(__dirname, './src/index-webpack.js')
    },

    // Final output file
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'jsfilemanager.min.js'
    },

    // Generate source map
    devtool: 'source-map',

    module: {
        rules: [
            // Load images
            {
                test: /\.(svg|png|gif|jpg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1024 * 1024 * 16
                    }
                }
            },

            // Load JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ]
                    }
                }
            }
        ]
    }

};
