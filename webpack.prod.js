const { config } = require("webpack");
const { default: merge } = require("webpack-merge");

module.exports = merge(config, {
    mode: 'production'
})