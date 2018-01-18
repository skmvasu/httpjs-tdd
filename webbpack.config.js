const path = require("path"),
  webpack = require("webpack"),
  CleanWebpackPlugin = require("clean-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractPlugin = new ExtractTextPlugin({
  filename: "./assets/css/app.css"
});

const config = {
  // absolute path for project root
  context: path.resolve(__dirname, "src"),

  entry: {
    // relative path declaration
    app: "./http.js"
  },

  output: {
    // absolute path declaration
    path: path.resolve(__dirname, "dist"),
    filename: "./examples/public/[name].bundle.js"
  },

  module: {
    rules: [
      // babel-loader with 'env' preset
      {
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
        use: { loader: "babel-loader", options: { presets: ["env"] } }
      },
      // html-loader
      { test: /\.html$/, use: ["html-loader"] }
    ]
  },

  plugins: [
    // cleaning up only 'dist' folder
    new CleanWebpackPlugin(["examples"]),
    // extract-text-webpack-plugin instance
    extractPlugin
  ],

  devtool: "inline-source-map"
};

module.exports = config;
