import type { iconType } from "./types";
import { h, defineComponent, type Component } from "vue";
import { FontIcon, IconifyIconOnline, IconifyIconOffline } from "../index";

const ifReg = /^IF-/;
const svgReg = /^\s*<svg[\s>]/;
const svgCache = new Map<string, string>();
const imgReg = /^(https?:\/\/|\/\/|data:image\/)/;

/**
 * 支持 `iconfont`、`SVG` 字符串、`SVG` 函数组件、图片 `URL` 以及 `iconify` 中所有的图标
 * @see 点击查看文档图标篇 {@link https://pure-admin.cn/pages/icon/}
 * @param icon 必传 图标
 * @param attrs 可选 iconType 属性
 * @returns Component
 */
export function useRenderIcon(icon: any, attrs?: iconType): Component {
  if (typeof icon === "string" && svgReg.test(icon)) {
    // SVG 字符串
    let cleanedSvg = svgCache.get(icon);
    if (cleanedSvg === undefined) {
      if (svgCache.size > 200) svgCache.clear();
      cleanedSvg = icon.replace(
        /<svg([^>]*)>/,
        (_, a) => `<svg${a.replace(/\s*(width|height)="[^"]*"/g, "")}>`
      );
      svgCache.set(icon, cleanedSvg);
    }
    return defineComponent({
      name: "SvgRawIcon",
      render: () =>
        h("span", {
          class: "svg-raw-icon",
          innerHTML: cleanedSvg,
          ...attrs
        })
    });
  } else if (typeof icon === "string" && imgReg.test(icon)) {
    // 图片 URL
    return defineComponent({
      name: "ImgIcon",
      render: () =>
        h("img", {
          src: icon,
          style: {
            width: "18px",
            height: "18px",
            minWidth: "18px",
            objectFit: "contain"
          },
          ...attrs
        })
    });
  } else if (ifReg.test(icon)) {
    // iconfont
    const name = icon.split(ifReg)[1];
    const spaceIdx = name.indexOf(" ");
    const iconName = spaceIdx === -1 ? name : name.slice(0, spaceIdx);
    const iconType = spaceIdx === -1 ? name : name.slice(spaceIdx + 1);
    return defineComponent({
      name: "FontIcon",
      render() {
        return h(FontIcon, {
          icon: iconName,
          iconType,
          ...attrs
        });
      }
    });
  } else if (typeof icon === "function" || typeof icon?.render === "function") {
    // SVG 函数组件
    return attrs ? h(icon, { ...attrs }) : icon;
  } else if (typeof icon === "object") {
    return defineComponent({
      name: "OfflineIcon",
      render() {
        return h(IconifyIconOffline, {
          icon: icon,
          ...attrs
        });
      }
    });
  } else {
    // 通过是否存在 : 符号来判断是在线还是本地图标，存在即是在线图标，反之
    return defineComponent({
      name: "Icon",
      render() {
        if (!icon) return;
        const IconifyIcon = icon.includes(":")
          ? IconifyIconOnline
          : IconifyIconOffline;
        return h(IconifyIcon, {
          icon,
          ...attrs
        });
      }
    });
  }
}
