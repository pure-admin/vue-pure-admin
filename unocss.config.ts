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
    "wh-full": "w-full h-full",
    "flex-c": "flex justify-center items-center",
    "flex-ac": "flex justify-around items-center",
    "flex-bc": "flex justify-between items-center",
    "bg-hover-dark9": "dark:color-white hover:bg-primary hover:dark:bg-primary"
  },
  theme: {
    colors: {
      primary_light_9: "var(--el-color-primary-light-9)",
      primary: "var(--el-color-primary)"
    },
    backgroundColor: {
      dark: "#020409"
    },
    transitionProperty: [
      "width",
      "height",
      "background",
      "background-color",
      "padding-left",
      "border-color",
      "right",
      "fill"
    ]
  }
});
