
import type { UserConfig } from 'vite'
import dotEnv from 'dotenv'
import path from 'path'

const VUE_APP_ENV = 'development'
const resolve = dir => path.join(__dirname, dir)
const { VITE_PROXY_DOMAIN } = dotEnv.config({
  path: resolve(`.env.${VUE_APP_ENV}`)
}).parsed


const alias: Record<string, string> = {
  '/@/': resolve('src')
}

const root: string = process.cwd()

const viteConfig: UserConfig = {
  root,
  alias,
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
      target: VITE_PROXY_DOMAIN,
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, '')
    }
  },
  /**
   * Transpile target for esbuild.
   * @default 'es2020'
   */
  esbuildTarget: 'es2019'
}

export default viteConfig