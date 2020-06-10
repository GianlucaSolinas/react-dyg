const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const app = {
  rooturl: path.resolve(__dirname, ''),
  disturl: path.resolve(__dirname, 'dist')
};

const aliases = {
  alias: {
    '@app': path.resolve(__dirname, 'src/'),
    '@pages': path.resolve(__dirname, 'src/pages/'),
    '@components': path.resolve(__dirname, 'src/components/'),
    '@api': path.resolve(__dirname, 'src/api/'),
    '@routes': path.resolve(__dirname, 'src/routes/'),
    '@layouts': path.resolve(__dirname, 'src/layouts/'),
    '@utils': path.resolve(__dirname, 'src/utils/'),
    '@styles': path.resolve(__dirname, 'src/styles/')
  }
};

const plugins = [
  new CleanWebpackPlugin(),
  new CopyWebpackPlugin(
    [
      { from: `*.md`, to: app.disturl },
      { from: `package.json`, to: app.disturl }
    ],
    {
      ignore: ['index.html']
    }
  )
];

module.exports = {
  mode: 'production',
  entry: {
    app: './src/index.js'
  },
  output: {
    path: app.disturl,
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: plugins,
  resolve: aliases,
  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      }
    }
  ]
};
