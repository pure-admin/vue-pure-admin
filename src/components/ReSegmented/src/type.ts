import type { VNode, Component } from "vue";
import type { iconType } from "@/components/ReIcon/src/types.ts";

export interface OptionsType {
  /** 文字 */
  label?: string | (() => VNode | Component);
  /**
   * @description 图标，采用平台内置的 `useRenderIcon` 函数渲染
   * @see {@link 用法参考 https://yiming_chang.gitee.io/pure-admin-doc/pages/icon/#%E9%80%9A%E7%94%A8%E5%9B%BE%E6%A0%87-userendericon-hooks }
   */
  icon?: string | Component;
  /** 图标属性、样式配置 */
  iconAttrs?: iconType;
  /** 值 */
  value?: any;
  /** 是否禁用 */
  disabled?: boolean;
  /** `tooltip` 提示 */
  tip?: string;
}
