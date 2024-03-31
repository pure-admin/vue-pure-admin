import { getPluginsList } from "./build/plugins";
import { type UserConfigExport, type ConfigEnv, loadEnv } from "@farmfe/core";
import { root, alias, warpperEnv, __APP_INFO__ } from "./build/utils";
import postcss from "@farmfe/js-plugin-postcss";
import sass from "@farmfe/js-plugin-sass";

export default ({ mode }: ConfigEnv): UserConfigExport => {
  const { VITE_CDN, VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH } =
    warpperEnv(loadEnv(mode, root)[0]);
  return {
    compilation: {
      presetEnv: false,
      output: {
        publicPath: VITE_PUBLIC_PATH,
        targetEnv: "browser-es2015",
        filename: "static/[ext]/[name]-[hash].[ext]",
        assetsFilename: "static/[ext]/[name]-[hash].[ext]"
      },
      resolve: {
        alias
      },
      script: {
        plugins: [
          {
            name: "@swc/plugin-remove-console",
            options: {
              exclude: ["error"]
            },
            filters: {
              moduleTypes: ["js", "ts", "jsx", "tsx"]
            }
          }
        ]
      },
      externalNodeBuiltins: false,
      define: {
        __INTLIFY_PROD_DEVTOOLS__: false,
        __APP_INFO__: process.env.FARM_FE
          ? __APP_INFO__
          : JSON.stringify(__APP_INFO__)
      }
    },
    root,
    // 服务端渲染
    server: {
      // open: true,
      port: VITE_PORT
    },
    plugins: [
      sass({
        legacy: true
      }),
      postcss(),
      {
        name: "remove-css-filter-plugin",
        priority: 0,
        transform: {
          filters: {
            resolvedPaths: ["element-plus/dist/index.css"]
          },
          async executor({ content }) {
            return {
              content: content.replace(/filter:\s*alpha\(opacity=0\);/g, "")
            };
          }
        }
      }
    ],
    vitePlugins: getPluginsList(VITE_CDN, VITE_COMPRESSION)
  };
};
