const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getFileList = require('./getFileList');

// 多入口配置

const fileList = getFileList('./src/pages/');

const entryMap = {};
fileList.forEach((file) => {
  if (/\.js|jsx$/.test(file.filename)) {
    let path = file.path.replace(/\.\/src\/pages\//, '');
    let name = file.filename.replace(/\.js$/, '').replace(/\.jsx$/, '');
    entryMap[`${path}${name}`] = `${file.path}${name}`;
  }
});
const outputPath = '../../htdocs/static';
// const outputPath = '../static';
module.exports = {
  entry: entryMap,
  stats: "minimal",
  output: {
    path: path.join(__dirname, outputPath),
    filename: 'dist/[name].js'
  },
  module: {
    rules: [
      // {
      //   test: /\.(js|jsx)$/,
      //   enforce: 'pre',
      //   loader: 'eslint-loader',
      //   options: {
      //     fix: true
      //   }
      // },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(svg|png|jpg|gif|lnk|ico)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'img/[name].[ext]',
          outputPath: outputPath,
          publicPath: '/'
        }
      }
    ]
  },
  externals: {},
  resolve: {
    alias: {
      models: path.resolve(__dirname, '../src/models'),
      routes: path.resolve(__dirname, '../src/routes'),
      pages: path.resolve(__dirname, '../src/pages'),
      components: path.resolve(__dirname, '../src/components'),
      modules: path.resolve(__dirname, '../src/modules'),
      styles: path.resolve(__dirname, '../src/styles'),
      utils: path.resolve(__dirname, '../src/utils'),
      layouts: path.resolve(__dirname, '../src/layouts'),
      img: path.resolve(__dirname, '../src/img'),
      constants: path.resolve(__dirname, '../src/constants')
    },
    extensions: ['.jsx', '.js']
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
      ReactDOM: 'react-dom',
      PropTypes: 'prop-types',
      dva: 'dva',
      antd: 'antd'
    }),
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, '../'),
      manifest: require('./vendor-manifest.json'),
      name: 'vendor'
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../libs'),
        to: path.resolve(__dirname, outputPath)
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../media'),
        to: path.resolve(__dirname, outputPath + '/media')
      }
    ]),
    new ProgressBarPlugin()
  ]
};
