import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import legacy from "@vitejs/plugin-legacy";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { warpperEnv, regExps } from "./build";
import { viteMockServe } from "vite-plugin-mock";
import styleImport from "vite-plugin-style-import";
import ElementPlus from "unplugin-element-plus/vite";
import { UserConfigExport, ConfigEnv, loadEnv } from "vite";
import themePreprocessorPlugin from "@zougt/vite-plugin-theme-preprocessor";

// 当前执行node命令时文件夹的地址（工作目录）
const root: string = process.cwd();

// 路径查找
const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};

// 设置别名
const alias: Record<string, string> = {
  "/@": pathResolve("src"),
  "@build": pathResolve("build"),
  //解决开发环境下的警告
  "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
};

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const {
    VITE_PORT,
    VITE_LEGACY,
    VITE_PUBLIC_PATH,
    VITE_PROXY_DOMAIN,
    VITE_PROXY_DOMAIN_REAL
  } = warpperEnv(loadEnv(mode, root));
  const prodMock = true;
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias
    },
    css: {
      // https://github.com/vitejs/vite/issues/5833
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: atRule => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    },
    // 服务端渲染
    server: {
      // 是否开启 https
      https: false,
      // 端口号
      port: VITE_PORT,
      host: "0.0.0.0",
      // 本地跨域代理
      proxy:
        VITE_PROXY_DOMAIN_REAL.length > 0
          ? {
              [VITE_PROXY_DOMAIN]: {
                target: VITE_PROXY_DOMAIN_REAL,
                // ws: true,
                changeOrigin: true,
                rewrite: (path: string) => regExps(path, VITE_PROXY_DOMAIN)
              }
            }
          : null
    },
    plugins: [
      vue(),
      // jsx、tsx语法支持
      vueJsx(),
      // 自定义主题
      themePreprocessorPlugin({
        scss: {
          multipleScopeVars: [
            {
              scopeName: "layout-theme-default",
              path: pathResolve("src/layout/theme/default-vars.scss")
            },
            {
              scopeName: "layout-theme-light",
              path: pathResolve("src/layout/theme/light-vars.scss")
            },
            {
              scopeName: "layout-theme-dusk",
              path: pathResolve("src/layout/theme/dusk-vars.scss")
            },
            {
              scopeName: "layout-theme-volcano",
              path: pathResolve("src/layout/theme/volcano-vars.scss")
            },
            {
              scopeName: "layout-theme-yellow",
              path: pathResolve("src/layout/theme/yellow-vars.scss")
            },
            {
              scopeName: "layout-theme-mingQing",
              path: pathResolve("src/layout/theme/mingQing-vars.scss")
            },
            {
              scopeName: "layout-theme-auroraGreen",
              path: pathResolve("src/layout/theme/auroraGreen-vars.scss")
            },
            {
              scopeName: "layout-theme-pink",
              path: pathResolve("src/layout/theme/pink-vars.scss")
            },
            {
              scopeName: "layout-theme-saucePurple",
              path: pathResolve("src/layout/theme/saucePurple-vars.scss")
            }
          ],
          // 默认取 multipleScopeVars[0].scopeName
          defaultScopeName: "",
          // 在生产模式是否抽取独立的主题css文件，extract为true以下属性有效
          extract: true,
          // 独立主题css文件的输出路径，默认取 viteConfig.build.assetsDir 相对于 (viteConfig.build.outDir)
          outputDir: "",
          // 会选取defaultScopeName对应的主题css文件在html添加link
          themeLinkTagId: "head",
          // "head"||"head-prepend" || "body" ||"body-prepend"
          themeLinkTagInjectTo: "head",
          // 是否对抽取的css文件内对应scopeName的权重类名移除
          removeCssScopeName: false,
          // 可以自定义css文件名称的函数
          customThemeCssFileName: scopeName => scopeName
        }
      }),
      // svg组件化支持
      svgLoader(),
      // 按需加载vxe-table
      styleImport({
        libs: [
          {
            libraryName: "vxe-table",
            esModule: true,
            ensureStyleFile: true,
            resolveComponent: name => `vxe-table/es/${name}`,
            resolveStyle: name => `vxe-table/es/${name}/style.css`
          }
        ]
      }),
      ElementPlus({}),
      // mock支持
      viteMockServe({
        mockPath: "mock",
        localEnabled: command === "serve",
        prodEnabled: command !== "serve" && prodMock,
        injectCode: `
          import { setupProdMockServer } from './mockProdServer';
          setupProdMockServer();
        `,
        logger: true
      }),
      // 是否为打包后的文件提供传统浏览器兼容性支持
      VITE_LEGACY
        ? legacy({
            targets: ["ie >= 11"],
            additionalLegacyPolyfills: ["regenerator-runtime/runtime"]
          })
        : null
    ],
    optimizeDeps: {
      include: [
        "element-plus/lib/locale/lang/zh-cn",
        "element-plus/lib/locale/lang/en",
        "vxe-table/lib/locale/lang/zh-CN",
        "vxe-table/lib/locale/lang/en-US"
      ],
      exclude: ["@zougt/vite-plugin-theme-preprocessor/dist/browser-utils"]
    },
    build: {
      sourcemap: false,
      brotliSize: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false
    }
  };
};
