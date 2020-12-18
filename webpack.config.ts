import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import HtmlWebpackTagsPlugin from "html-webpack-tags-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import webpack from "webpack";

const config = (env?: NodeJS.ProcessEnv): webpack.Configuration => ({
  mode: env?.prod ? "production" : "none",
  entry: ["./src/script.ts"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-typescript",
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: "3.8"
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: env?.chrome ? "src/manifest.chrome.json" : "src/manifest.json",
          to: "manifest.json"
        },
        { from: "icons/icon*.png" },
        ...(env?.chrome
          ? [
              {
                from:
                  "node_modules/webextension-polyfill/dist/browser-polyfill.js"
              }
            ]
          : [])
      ]
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: "popup.html",
      title: "Tab2QR",
      template: "src/popup.html"
    }),
    ...(env?.chrome
      ? [
          new HtmlWebpackTagsPlugin({
            tags: ["browser-polyfill.js"],
            append: false
          })
        ]
      : [])
  ],
  devtool: env?.prod ? undefined : "inline-source-map"
});

export default config;
