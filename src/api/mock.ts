import { http } from "../utils/http";

// 地图数据
export const mapJson = (data?: object) => {
  return http.request("get", "/getMapInfo", data);
};

// echarts数据
export const echartsJson = (data?: object) => {
  return http.request("get", "/getEchartsInfo", data);
};
