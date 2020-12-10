import dotEnv from 'dotenv'
import path from 'path'

const VUE_APP_ENV = 'development'
const resolve = dir => path.join(__dirname, dir)
const { VUE_APP_PROXY_DOMAIN } = dotEnv.config({
  path: resolve(`.env.${VUE_APP_ENV}`)
}).parsed

module.exports = {
  alias: {},
  // 是否自动在浏览器打开
  open: false,
  // 是否开启 https
  https: false,
  // 服务端渲染
  ssr: false,
  /**
   * Base public path when served in production.
   * @default '/'
   */
  /**
   * Directory relative from `root` where build output will be placed. If the
   * directory exists, it will be removed before the build.
   * @default 'dist'
   */
  // 反向代理
  proxy: {
    '/api': {
      target: VUE_APP_PROXY_DOMAIN,
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, '')
    }
  }
}