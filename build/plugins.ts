import vue from "@vitejs/plugin-vue";
import { viteBuildInfo } from "./info";
import svgLoader from "vite-svg-loader";
import legacy from "@vitejs/plugin-legacy";
import vueJsx from "@vitejs/plugin-vue-jsx";
import WindiCSS from "vite-plugin-windicss";
import { viteMockServe } from "vite-plugin-mock";
import liveReload from "vite-plugin-live-reload";
import styleImport from "vite-plugin-style-import";
import ElementPlus from "unplugin-element-plus/vite";
import { visualizer } from "rollup-plugin-visualizer";
import removeConsole from "vite-plugin-remove-console";
import themePreprocessorPlugin from "@zougt/vite-plugin-theme-preprocessor";

export function getPluginsList(command, VITE_LEGACY) {
  const prodMock = true;
  const lifecycle = process.env.npm_lifecycle_event;
  return [
    vue(),
    // jsx、tsx语法支持
    vueJsx(),
    WindiCSS(),
    // 线上环境删除console
    removeConsole(),
    viteBuildInfo(),
    // 修改layout文件夹下的文件时自动重载浏览器 解决 https://github.com/xiaoxian521/vue-pure-admin/issues/170
    liveReload(["src/layout/**/*", "src/router/**/*"]),
    // 自定义主题
    themePreprocessorPlugin({
      scss: {
        multipleScopeVars: [
          {
            scopeName: "layout-theme-default",
            path: "src/layout/theme/default-vars.scss"
          },
          {
            scopeName: "layout-theme-light",
            path: "src/layout/theme/light-vars.scss"
          },
          {
            scopeName: "layout-theme-dusk",
            path: "src/layout/theme/dusk-vars.scss"
          },
          {
            scopeName: "layout-theme-volcano",
            path: "src/layout/theme/volcano-vars.scss"
          },
          {
            scopeName: "layout-theme-yellow",
            path: "src/layout/theme/yellow-vars.scss"
          },
          {
            scopeName: "layout-theme-mingQing",
            path: "src/layout/theme/mingQing-vars.scss"
          },
          {
            scopeName: "layout-theme-auroraGreen",
            path: "src/layout/theme/auroraGreen-vars.scss"
          },
          {
            scopeName: "layout-theme-pink",
            path: "src/layout/theme/pink-vars.scss"
          },
          {
            scopeName: "layout-theme-saucePurple",
            path: "src/layout/theme/saucePurple-vars.scss"
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
      : null,
    // 打包分析
    lifecycle === "report"
      ? visualizer({ open: true, brotliSize: true, filename: "report.html" })
      : null
  ];
}
