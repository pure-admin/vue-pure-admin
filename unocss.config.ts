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
  exclude: [`${__dirname}/node_modules/**/*`],
  shortcuts: {
    "bg-dark": "bg-bg_color",
    "wh-full": "w-full h-full",
    "cp-on": "cursor-pointer outline-none",
    "flex-c": "flex justify-center items-center",
    "flex-ac": "flex justify-around items-center",
    "flex-bc": "flex justify-between items-center",
    "navbar-bg-hover":
      "dark:color-white hover:bg-[#f6f6f6] dark:hover:bg-[#242424]"
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
