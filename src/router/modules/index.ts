// 静态路由
import about from "./about";
import homeRouter from "./home";
import ableRouter from "./able";
import errorRouter from "./error";
import guideRouter from "./guide";
import resultRouter from "./result";
import editorRouter from "./editor";
import nestedRouter from "./nested";
import flowChartRouter from "./flowchart";
import remainingRouter from "./remaining";
import componentsRouter from "./components";
import { RouteRecordRaw, RouteComponent } from "vue-router";

import {
  ascending,
  formatTwoStageRoutes,
  formatFlatteningRoutes
} from "../utils";
import { buildHierarchyTree } from "/@/utils/tree";

// 原始静态路由（未做任何处理）
const routes = [
  about,
  homeRouter,
  ableRouter,
  errorRouter,
  guideRouter,
  resultRouter,
  nestedRouter,
  editorRouter,
  flowChartRouter,
  componentsRouter
];

// 导出处理后的静态路由（三级及以上的路由全部拍成二级）
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(routes)))
);

// 用于渲染菜单，保持原始层级
export const constantMenus: Array<RouteComponent> = ascending(routes).concat(
  ...remainingRouter
);

// 不参与菜单的路由
export const remainingPaths = Object.keys(remainingRouter).map(v => {
  return remainingRouter[v].path;
});
