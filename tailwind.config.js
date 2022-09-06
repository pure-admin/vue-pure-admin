const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg_color: "var(--el-bg-color)",
        primary: "var(--el-color-primary)",
        primary_light_9: "var(--el-color-primary-light-9)",
        text_color_primary: "var(--el-text-color-primary)",
        text_color_regular: "var(--el-text-color-regular)",
        text_color_disabled: "var(--el-text-color-disabled)"
      }
    }
  },
  corePlugins: {
    preflight: false
  },
  plugins: [
    plugin(function ({ addComponents }) {
      // https://github.com/tailwindlabs/tailwindcss/pull/412
      // addComponents({
      //   '.flex-c': {
      //     "@apply flex justify-center items-center": {}
      //   }
      // })
    })
  ]
};
