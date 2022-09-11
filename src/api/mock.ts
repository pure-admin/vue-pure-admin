import { http } from "../utils/http";

type Result = {
  code: number;
  info: Array<any>;
};

/** 地图数据 */
export const mapJson = (params?: object) => {
  return http.request<Result>("get", "/getMapInfo", { params });
};
