const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function findPackages() {
  const pkgRoot = path.join(__dirname, '..', 'packages')

  return fs
    .readdirSync(pkgRoot)
    .filter((entry) => {
      const pkgPath = path.join(pkgRoot, entry)

      return (
        !['.', '..'].includes(entry) &&
        fs.lstatSync(pkgPath).isDirectory() &&
        fs.existsSync(path.join(pkgPath, 'package.json'))
      )
    })
    .map((dir) => {
      const jsonPath = path.join(pkgRoot, dir, 'package.json')
      const { name } = JSON.parse(fs.readFileSync(jsonPath).toString('utf-8'))

      return { dir, name }
    })
}

const alias = findPackages().reduce((alias, { dir, name }) => {
  alias[name] = path.resolve(__dirname, `../packages/${dir}/src`)

  return alias
}, {})

module.exports = {
  entry: path.resolve(__dirname, '..', './packages/lily-web/src/index.js'),
  resolve: {
    alias,
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, '..', './build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', './public/index.html'),
    }),
    new MiniCssExtractPlugin(),
  ],
  stats: 'errors-only',
}
