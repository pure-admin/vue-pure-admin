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
    "flex-ac": "flex justify-around items-center",
    "flex-bc": "flex justify-between items-center"
  },
  theme: {}
});
