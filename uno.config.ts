import {
  transformerVariantGroup,
  transformerDirectives,
  presetAttributify,
  defineConfig,
  presetMini,
  presetUno
} from "unocss";

// https://github.com/unocss/unocss#readme
export default defineConfig({
  presets: [presetMini({ dark: "class" }), presetAttributify(), presetUno()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  // unocss默认不扫描 node_modules、dist、css以及其扩展 具体实现：https://github.com/unocss/unocss/blob/03c8abe8f5020b3baaed3dfbfe8e2258dd041a7e/packages/vite/src/utils.ts#L3
  exclude: [
    "node_modules",
    "dist",
    ".git",
    ".github",
    ".husky",
    ".vscode",
    "build",
    "locales",
    "mock",
    "public",
    "types",
    ".eslintrc.js",
    ".prettierrc.js",
    "postcss.config.js",
    "stylelint.config.js",
    "commitlint.config.js",
    "README.md",
    "CHANGELOG.md",
    "README.en-US.md",
    "CHANGELOG.en_US.md",
    "CHANGELOG.zh_CN.md"
  ],
  shortcuts: {
    "bg-dark": "bg-bg_color",
    "wh-full": "w-full h-full",
    "flex-wrap": "flex flex-wrap",
    "flex-c": "flex justify-center items-center",
    "flex-ac": "flex justify-around items-center",
    "flex-bc": "flex justify-between items-center",
    "navbar-bg-hover": "dark:color-white !dark:hover:bg-[#242424]"
  },
  theme: {
    colors: {
      bg_color: "var(--el-bg-color)",
      primary: "var(--el-color-primary)",
      primary_light_9: "var(--el-color-primary-light-9)",
      text_color_primary: "var(--el-text-color-primary)",
      text_color_regular: "var(--el-text-color-regular)",
      text_color_disabled: "var(--el-text-color-disabled)"
    }
  }
});
