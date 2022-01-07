// https://cn.windicss.org/ 中文文档
import { defineConfig } from "windicss/helpers";
import colors from "windicss/colors";
import typography from "windicss/plugin/typography";

export default defineConfig({
  darkMode: "class",
  attributify: true,

  plugins: [typography()],
  theme: {
    extend: {
      zIndex: {
        "-1": "-1"
      },
      screens: {
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        "2xl": "1600px"
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "65ch",
            color: "inherit",
            a: {
              color: "inherit",
              opacity: 0.75,
              fontWeight: "500",
              textDecoration: "underline",
              "&:hover": {
                opacity: 1,
                color: colors.teal[600]
              }
            },
            b: { color: "inherit" },
            strong: { color: "inherit" },
            em: { color: "inherit" },
            h1: { color: "inherit" },
            h2: { color: "inherit" },
            h3: { color: "inherit" },
            h4: { color: "inherit" },
            code: { color: "inherit" }
          }
        }
      }
    }
  }
});
