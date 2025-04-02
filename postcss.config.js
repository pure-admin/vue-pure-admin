// @ts-check

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {})
  }
};
