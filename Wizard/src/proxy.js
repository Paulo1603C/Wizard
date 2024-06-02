
import { createProxyMiddleware } from 'http-proxy-middleware';

const apiProxy = createProxyMiddleware({
  target: 'http://test.wanqara.com/api/send-code', // URL del API
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
});

export default apiProxy;