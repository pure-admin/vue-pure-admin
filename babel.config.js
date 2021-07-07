const productPlugins = [];
process.env.NODE_ENV === "production" &&
  productPlugins.push("transform-remove-console");
module.exports = {
  plugins: [...productPlugins]
};
