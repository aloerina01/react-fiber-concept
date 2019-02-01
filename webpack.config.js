const path = require('path');

const __MODE__ = process.env.NODE_ENV; 
const __DEV__ = __MODE__ === 'development';

module.exports = {
  mode: __MODE__ || 'development',
  entry: `./src/index.tsx`,
  output: {
    path: path.join(__dirname, 'dist/tsc'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
}