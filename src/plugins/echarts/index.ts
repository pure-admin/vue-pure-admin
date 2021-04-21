import * as echarts from "echarts/core";

import {
  BarChart,
  LineChart,
  PieChart,
  MapChart,
  PictorialBarChart,
  RadarChart,
} from "echarts/charts";

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  LegendComponent,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
} from "echarts/components";

import { SVGRenderer } from "echarts/renderers";

const { use, registerTheme } = echarts;

use([
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  BarChart,
  LineChart,
  PieChart,
  MapChart,
  RadarChart,
  SVGRenderer,
  PictorialBarChart,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
]);

// 自定义主题
import theme from "./theme.json";
registerTheme("ovilia-green", theme);

export default echarts;
