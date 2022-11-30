import type { App } from "vue";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, BarChart, LineChart } from "echarts/charts";
import {
  GridComponent,
  TitleComponent,
  LegendComponent,
  GraphicComponent,
  ToolboxComponent,
  TooltipComponent,
  DataZoomComponent,
  VisualMapComponent
} from "echarts/components";

const { use } = echarts;
// const { use, registerTheme } = echarts;

use([
  PieChart,
  BarChart,
  LineChart,
  CanvasRenderer,
  GridComponent,
  TitleComponent,
  LegendComponent,
  GraphicComponent,
  ToolboxComponent,
  TooltipComponent,
  DataZoomComponent,
  VisualMapComponent
]);

/**
 * @description 自定义主题
 * @see {@link https://echarts.apache.org/zh/download-theme.html}
 */
// import theme from "./theme.json";
// registerTheme("ovilia-green", theme);

/**
 * @description 按需引入echarts
 * @see {@link https://echarts.apache.org/handbook/zh/basics/import#%E6%8C%89%E9%9C%80%E5%BC%95%E5%85%A5-echarts-%E5%9B%BE%E8%A1%A8%E5%92%8C%E7%BB%84%E4%BB%B6}
 * @see 温馨提示：必须将 `$echarts` 添加到全局 `globalProperties` ，为了配合 https://pure-admin-utils.netlify.app/hooks/useEcharts/useEcharts.html 使用
 */
export function useEcharts(app: App) {
  app.config.globalProperties.$echarts = echarts;
}

export default echarts;
