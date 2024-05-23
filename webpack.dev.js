const { config } = require("webpack");
const { default: merge } = require("webpack-merge");

module.exports = merge(config, {
    mode: 'development',
    devtool: 'inline-source-map'
})