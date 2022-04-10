import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer";
import mapMock from "../mock/map";
import systemMock from "../mock/system";
import asyncRoutesMock from "../mock/asyncRoutes";

export const mockModules = [...mapMock, ...systemMock, ...asyncRoutesMock];

export function setupProdMockServer() {
  createProdMockServer(mockModules);
}
