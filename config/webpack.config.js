var path = require('path');

module.exports = {
  entry: [
    './app/app.js' // Your appʼs entry point
  ],
  output: {
    filename: 'bundle.js', //this is the default name, so you can skip it
    //at this directory our bundle file will be available
    //make sure port 8090 is used when launching webpack-dev-server
    publicPath: 'http://localhost:8091/assets/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["babel?presets[]=es2015"],
        exclude: /node_modules/
      },
      { test: /\.scss$/, loaders: ["style", "css", "sass"] },
      { test: /\.css$/, loader: 'style-loader!css-loader'  }
    ]
  }
}
