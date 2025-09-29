// webpack.config.js
const path = require("path");

module.exports = {
  mode: "development", // change to "production" for release
  entry: {
    background: "./background.ts",
    content: "./content.ts",
    options: "./options.ts",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  output: {
    filename: "[name].js", // background.js, content.js, options.js
    path: path.resolve(__dirname, "build"),
  },
  devtool: "cheap-module-source-map",
};
