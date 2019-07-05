/* eslint-disable no-undef */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const isDevelopment = process.env.NODE_ENV === "development";

const alias = {
  jQuery: path.resolve("./node_modules/jquery"),
  $: path.resolve("./node_modules/jquery"),
  vue: "vue/dist/vue.js"
};

const part = {
  resolve: {
    alias,
    extensions: [".js", ".css", ".json", ".vue"]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        loader: "url-loader",
        //include: path.join(__dirname, ''),
        options: {
          publicPath: "./",
          limit: 10000
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              minimize: !isDevelopment,
              importLoaders: 1,
              modules: true,
              sourceMap: isDevelopment
            }
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: () => [
                require("postcss-import"),
                require("postcss-cssnext")({
                  features: {
                    customProperties: {
                      warnings: false
                    }
                  }
                }),
                require('tailwindcss'),
                require("autoprefixer")(),
                require("cssnano")()
              ],
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin()
  ]
};

const purgecss = require('@fullhuman/postcss-purgecss')({
  // Specify the paths to all of the template files in your project
  content: [
    './src/**/*.html',
    './src/**/*.liquid',
    './src/**/*.vue',
    './src/**/*.jsx',
    // etc.
  ],

  // Include any special characters you're using in this regular expression
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
});

module.exports = {
  "webpack.extend": config => {
    return part;
  },
  'webpack.postcss.plugins': (config, defaultValue) => [
      require('tailwindcss'),
      require('autoprefixer'),
      require('cssnano')({
        preset: 'default',
      }),
      ...defaultValue,
      ...process.env.NODE_ENV === 'production' ? [purgecss] : []
  ]
};
