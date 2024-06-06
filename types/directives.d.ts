import type { Directive } from "vue";
import type { CopyEl, OptimizeOptions, RippleOptions } from "@/directives";

declare module "vue" {
  export interface ComponentCustomProperties {
    /** `Loading` 动画加载指令，具体看：https://element-plus.org/zh-CN/component/loading.html#%E6%8C%87%E4%BB%A4 */
    vLoading: Directive<Element, boolean>;
    /** 按钮权限指令 */
    vAuth: Directive<HTMLElement, string | Array<string>>;
    /** 文本复制指令（默认双击复制） */
    vCopy: Directive<CopyEl, string>;
    /** 长按指令 */
    vLongpress: Directive<HTMLElement, Function>;
    /** 防抖、节流指令 */
    vOptimize: Directive<HTMLElement, OptimizeOptions>;
    /**
     * `v-ripple`指令，用法如下：
     * 1. `v-ripple`代表启用基本的`ripple`功能
     * 2. `v-ripple="{ class: 'text-red' }"`代表自定义`ripple`颜色，支持`tailwindcss`，生效样式是`color`
     * 3. `v-ripple.center`代表从中心扩散
     */
    vRipple: Directive<HTMLElement, RippleOptions>;
  }
}

export {};
