var path = require("path");

module.exports = function(config) {
  config.set({
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
            include: path.resolve(__dirname, "../src"),
            exclude: /(bower_components|node_modules|__tests__)/,
            loader: "babel",
            query: {
              cacheDirectory: true
            }
          }
        ]
      }
    }
  });
};
