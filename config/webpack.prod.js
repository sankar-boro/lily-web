const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')

module.exports = (envVars) => {
  return {
    mode: 'production',
    devtool: 'source-map',
    output: {
      publicPath: '/',
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.name': JSON.stringify('lily-web'),
      }),
      new Dotenv({
        path: './prod.env',
      }),
    ],
  }
}
