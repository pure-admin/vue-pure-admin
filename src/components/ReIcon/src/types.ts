import type { CSSProperties } from "vue";

export interface iconType {
  // iconify (https://docs.iconify.design/icon-components/vue/#properties)
  inline?: boolean;
  width?: string | number;
  height?: string | number;
  horizontalFlip?: boolean;
  verticalFlip?: boolean;
  flip?: string;
  rotate?: number | string;
  color?: string;
  horizontalAlign?: boolean;
  verticalAlign?: boolean;
  align?: string;
  onLoad?: (name: string) => void;
  includes?: (name: string) => boolean;
  // svg 需要什么SVG属性自行添加
  fill?: string;
  // all icon
  style?: CSSProperties;
}
