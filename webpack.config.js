const HtmlWebPackPlugin = require("html-webpack-plugin")

module.exports = {
    target:'node',
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: { minimize: true }
                }]
            }
        ]
    },
    plugins:[
        new HtmlWebPackPlugin({
            template:"./src/index.html",
            filename:"./index.html"
        })
    ]
}