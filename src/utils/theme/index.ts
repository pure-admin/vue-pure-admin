import rgbHex from "rgb-hex";
import color from "css-color-function";
import epCss from "element-plus/dist/index.css";

const formula = {
  "shade-1": "color(primary shade(10%))",
  "light-1": "color(primary tint(10%))",
  "light-2": "color(primary tint(20%))",
  "light-3": "color(primary tint(30%))",
  "light-4": "color(primary tint(40%))",
  "light-5": "color(primary tint(50%))",
  "light-6": "color(primary tint(60%))",
  "light-7": "color(primary tint(70%))",
  "light-8": "color(primary tint(80%))",
  "light-9": "color(primary tint(90%))"
};

export const writeNewStyle = newStyle => {
  const style = window.document.createElement("style");
  style.innerText = newStyle;
  window.document.head.appendChild(style);
};

export const createNewStyle = primaryStyle => {
  const colors = createColors(primaryStyle);
  let cssText = getOriginStyle();
  Object.keys(colors).forEach(key => {
    cssText = cssText.replace(
      new RegExp("(:|\\s+)" + key, "g"),
      "$1" + colors[key]
    );
  });
  return cssText;
};

export const createColors = primary => {
  if (!primary) return;
  const colors = {
    primary
  };
  Object.keys(formula).forEach(key => {
    const value = formula[key].replace(/primary/, primary);
    colors[key] = "#" + rgbHex(color.convert(value));
  });
  return colors;
};

export const getOriginStyle = () => {
  return getStyleTemplate(epCss);
};

const getStyleTemplate = data => {
  const colorMap = {
    "#3a8ee6": "shade-1",
    "#409eff": "primary",
    "#53a8ff": "light-1",
    "#66b1ff": "light-2",
    "#79bbff": "light-3",
    "#8cc5ff": "light-4",
    "#a0cfff": "light-5",
    "#b3d8ff": "light-6",
    "#c6e2ff": "light-7",
    "#d9ecff": "light-8",
    "#ecf5ff": "light-9"
  };
  Object.keys(colorMap).forEach(key => {
    const value = colorMap[key];
    data = data.replace(new RegExp(key, "ig"), value);
  });
  return data;
};
