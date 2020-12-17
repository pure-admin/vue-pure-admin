
import { resolve } from 'path'
import type { UserConfig } from 'vite'
import { loadEnv } from './build/utils'
import { createProxy } from './build/proxy'

const pathResolve = (dir: string): any =>  {
  return resolve(__dirname, '.', dir)
}

const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_OPEN } = loadEnv()

const alias: Record<string, string> = {
  '/@/': pathResolve('src'),
}

const root: string = process.cwd()

const viteConfig: UserConfig = {
  root,
  alias,
  // 是否开启 https
  https: false,
  // 服务端渲染
  ssr: false,
  sourcemap: true,
  /**
   * 端口号
   * @default 3000
   */
  port: VITE_PORT,
    /**
   * 运行自动打开浏览器·
   * @default 'false'
   */
  open: VITE_OPEN,
  /**
   * 基本公共路径
   * @default '/'
   */
  base: VITE_PUBLIC_PATH,
  /**
   * Transpile target for esbuild.
   * @default 'es2020'
   */
  esbuildTarget: 'es2020',
  // 本地跨域代理
  proxy: createProxy(VITE_PROXY)
}

export default viteConfig