const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/client/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "./dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/[hash][ext][query]",
        },
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/client/view/index.html",
    }),
  ],
};
