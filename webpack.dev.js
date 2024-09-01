const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: {
        popup: './src/popup.jsx'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true, // Omogoči CSS module
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][hash][ext]'
                }
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/popup.html',
            filename: 'popup.html',
            chunks: ['popup']  // Določi, da ta HTML uporablja samo `popup` bundle
        }),
        new CopyPlugin({
            patterns: [
                { from: "public", to: "" },
            ],
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        hot: true,
        open: true,
        watchFiles: ['src/**/*'],
        historyApiFallback: {
            index: 'popup.html'  // Nastavi privzeto datoteko, ki se odpre ob obisku
        }
    }
};
