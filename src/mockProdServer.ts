import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer";
import mapMock from "../mock/map";
import echartsMock from "../mock/echarts";
import asyncRoutesMock from "../mock/asyncRoutes";

export const mockModules = [...mapMock, ...echartsMock, ...asyncRoutesMock];

export function setupProdMockServer() {
  createProdMockServer(mockModules);
}
