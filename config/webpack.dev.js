const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = (envVars) => {
  return {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
      hot: true,
      open: true,
      host: envVars.HOST,
      port: envVars.PORT,
      historyApiFallback: true,
      allowedHosts: 'all',
    },
    plugins: [
      new ReactRefreshWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env.name': JSON.stringify('Sankar'),
      }),
      new Dotenv({
        path: './dev.env',
      }),
      new ESLintPlugin({
        context: './', // Location where it will scan all the files
        extensions: ['js', 'jsx'], // File formats that should be scanned
        exclude: ['node_modules', 'dist'], // Exclude everything in these folders
      }),
    ],
  }
}
