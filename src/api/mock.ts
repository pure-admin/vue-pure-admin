import { http } from "../utils/http";

// 地图数据
export const mapJson = (params?: object) => {
  return http.request("get", "/getMapInfo", { params });
};
