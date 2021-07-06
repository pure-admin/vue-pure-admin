import { http } from "../utils/http";

// 地图数据
export const mapJson = (data?: object): any => {
  return http.request("get", "/getMapInfo", data);
};

// echarts数据
export const echartsJson = (data?: object): any => {
  return http.request("get", "/getEchartsInfo", data);
};
