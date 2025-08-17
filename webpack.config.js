const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "src"),

  entry: "./scripts/main.js",

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist/museum"),
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      template: "./pages/battle.html",
      filename: "battle.html",
    }),
    new HtmlWebpackPlugin({
      template: "pages/profile.html",
      filename: "profile.html",
    }),
    new HtmlWebpackPlugin({
      template: "pages/settings.html",
      filename: "settings.html",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "[path][name][ext]",
        },
      },
      {
        test: /\.(mp4|webm|ogg)$/i,
        type: "asset/resource",
        generator: {
          filename: "[path][name][ext]",
        },
      },
      {
        test: /\.(woff2?|ttf|otf|eot)$/i,
        type: "asset/resource",
        generator: {
          filename: "[path][name][ext]",
        },
      },
      {
        test: /favicon\.ico$/i,
        type: "asset/resource",
        generator: {
          filename: "[name][ext]",
        },
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },

  devServer: {
    client: {
      overlay: {
        runtimeErrors: false,
      },
    },
    hot: true,
  },
};
