const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const htmlWebpackPlugin = require("html-webpack-plugin");
const devConf = require('./conf/webpack.dev');
const prodConf = require('./conf/webpack.prod');
const ROOTPATH = path.join(process.cwd());
const APP_PATH = path.join(ROOTPATH, '/src');
const build = process.env.NODE_ENV === 'production';
console.log(process.env.NODE_ENV)

const baseConf = {
  entry: {
    app:path.resolve(__dirname,'src/index.js')
  },
  output: {
    publicPath: '/',
    filename: '[name].js',
    path: path.join(ROOTPATH, '../dist')
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [
          // path.resolve(__dirname,'./node_modules/react/cjs'),
          path.resolve(__dirname,'./node_modules/react-dom/cjs'),
          path.resolve(__dirname,'./src')
        ]
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     'css-loader',
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         plugins: loader => {
      //           require('autoprefixer')();
      //         }
      //       }
      //     }
      //   ]
      // },
      // {
      //   test: /\.scss$/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     'css-loader',
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         sourceMap: true,
      //         config: {
      //           path: 'postcss.config.js'
      //         }
      //       }
      //     },
      //     'sass-loader'
      //   ]
      // },
      // {
      //   test: /\.less$/,
      //   use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      // },
      // {
      //   test: /\.(eot|woff|ttf|woff2|svg|gif|png|jpg)(\?|$)/,
      //   use: {
      //     loader: 'file-loader',
      //     options: {
      //       name: '[folder]/[name].[ext]',
      //       outputPath: './assets'
      //     }
      //   }
      // }
    ]
  },
  resolve: {
    alias: {
      '@': `${APP_PATH}/`,
    }
  },
  performance: {
    maxEntrypointSize: 2000000,
    maxAssetSize: 2000000
  },
  plugins: [
    // new MiniCssExtractPlugin({
    //   filename: '[name]/[name].css',
    //   chunkFilename: '[name]/[name].css',
    //   allChunks:true
    // }),
    new htmlWebpackPlugin({
      template:'./src/index.html'
    })
  ]
};

let mergeConf = build?prodConf:devConf;
module.exports = merge(baseConf,mergeConf);