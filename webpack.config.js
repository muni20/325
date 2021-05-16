const HtmlWebPackPlugin = require("html-webpack-plugin")
var nodeExternals = require('webpack-node-externals')

module.exports = {
    target:'node',
    externals:[nodeExternals()],
    entry:{server:['./server.js']},
    // external: {
    //     'socket.io-client': 'io'
    // },
    // resolve: {
    //     alias: {
    //         'socket.io-client': path.join(__dirname, 'node_modules', 'socket.io-client', 'socket.io.js')
    //     }
    // },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: { minimize: true }
                }]
            }
        ],
        // noParse: [ '/socket.io/socket.io.js' ],
    },
    plugins:[
        new HtmlWebPackPlugin({
            template:"./src/index.html",
            filename:"./index.html"
        })
    ]
}