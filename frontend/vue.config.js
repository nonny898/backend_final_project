module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    disableHostCheck: true
  },
  publicPath: '/',
  configureWebpack: {
    module: {
      rules: [
        {
          test: /config.*config\.js$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'config.js'
              },
            }
          ]
        }
      ]
    }
  }
}