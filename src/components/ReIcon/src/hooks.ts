import { h, defineComponent, Component } from "vue";
import { IconifyIconOffline, FontIcon } from "../index";

// 支持fontawesome4、5+、iconfont、remixicon、element-plus的icons、自定义svg
export function useRenderIcon(icon: string): Component {
  // iconfont
  const ifReg = /^IF-/;
  // typeof icon === "function" 属于SVG
  if (ifReg.test(icon)) {
    // iconfont
    const name = icon.split(ifReg)[1];
    const iconName = name.slice(
      0,
      name.indexOf(" ") == -1 ? name.length : name.indexOf(" ")
    );
    const iconType = name.slice(name.indexOf(" ") + 1, name.length);
    return defineComponent({
      name: "FontIcon",
      render() {
        return h(FontIcon, {
          icon: iconName,
          iconType
        });
      }
    });
  } else if (typeof icon === "function") {
    // svg
    return icon;
  } else {
    return defineComponent({
      name: "Icon",
      render() {
        return h(IconifyIconOffline, {
          icon: icon
        });
      }
    });
  }
}
