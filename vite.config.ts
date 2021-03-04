
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import type { UserConfig } from 'vite'
import { loadEnv } from './build/utils'
import { createProxy } from './build/proxy'

const pathResolve = (dir: string): any =>  {
  return resolve(__dirname, '.', dir)
}

const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_OPEN } = loadEnv()

const alias: Record<string, string> = {
  '/@': pathResolve('src'),
  'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js' //解决警告You are running the esm-bundler build of vue-i18n. It is recommended to configure your bundler to explicitly replace feature flag globals with boolean literals to get proper tree-shaking in the final bundle.
}

const root: string = process.cwd()

const viteConfig: UserConfig = {
  /**
   * 基本公共路径
   * @default '/'
   */
  base: process.env.NODE_ENV === "production" ? "/manages/" : VITE_PUBLIC_PATH,
  root,
  resolve: {
    alias
  },
  // 服务端渲染
  server: {
    // 是否开启 https
    https: false,
    /**
     * 端口号
     * @default 3000
     */
    port: VITE_PORT,
    // 本地跨域代理
    proxy: createProxy(VITE_PROXY)
  },
  plugins: [
    vue(),
  ],
  build: {
    brotliSize: false,
    // 消除打包大小超过500kb警告
    chunkSizeWarningLimit: 800
  }
}

export default viteConfig