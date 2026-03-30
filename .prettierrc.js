// @ts-check

/** @type {import("prettier").Config} */
export default {
  arrowParens: "avoid",
  trailingComma: "none",
  overrides: [
    {
      files: "*.json",
      options: {
        printWidth: 120
      }
    }
  ]
};
