
module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'https://test.wanqara.com',
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      }
    }
  }
  