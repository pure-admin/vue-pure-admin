import "./index.css";
import { h, defineComponent, Component } from "vue";

export interface attrsType {
  width?: string;
  height?: string;
  borderRadius?: number | string;
  background?: string;
  scale?: number | string;
}

/**
 * 圆点、方形闪烁动画组件
 * @param width 可选 string 宽
 * @param height 可选 string 高
 * @param borderRadius 可选 number | string 传0为方形、传50%或者不传为圆形
 * @param background 可选 string 闪烁颜色
 * @param scale 可选 number | string 闪烁范围，默认2，值越大闪烁范围越大
 * @returns Component
 */
export function useRenderFlicker(attrs?: attrsType): Component {
  return defineComponent({
    name: "ReFlicker",
    render() {
      return h(
        "div",
        {
          class: "point point-flicker",
          style: {
            "--point-width": attrs?.width ?? "12px",
            "--point-height": attrs?.height ?? "12px",
            "--point-background":
              attrs?.background ?? "var(--el-color-primary)",
            "--point-border-radius": attrs?.borderRadius ?? "50%",
            "--point-scale": attrs?.scale ?? "2"
          }
        },
        {
          default: () => []
        }
      );
    }
  });
}
