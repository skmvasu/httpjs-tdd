var path = require('path');

module.exports = function (config) {
  config.set({
    browsers: ["Chrome"],
    files: ["tests.webpack.js"],
    frameworks: ["jasmine"],
    preprocessors: {
      "./tests.webpack.js": ["webpack", "sourcemap"]
    },

    webpack: {
      cache: true,
      devtool: "inline-source-map",
      module: {
        loaders: [
          {
            test: /\.js$/,
            include: path.resolve(__dirname, "./src"),
            exclude: /(bower_components|node_modules)/,
            loader: "babel-loader",
            query: {
              presets: ["es2015", "stage-2"],
              plugins: [
                "transform-object-rest-spread",
                "transform-es2015-spread"
              ],
              cacheDirectory: true
            }
          }
        ]
      }
    }
  });
};