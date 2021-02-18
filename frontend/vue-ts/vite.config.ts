
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
}

const root: string = process.cwd()

const viteConfig: UserConfig = {
  /**
   * 基本公共路径
   * @default '/'
   */
  base: process.env.NODE_ENV === "production" ? "./" : VITE_PUBLIC_PATH,
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
}

export default viteConfig