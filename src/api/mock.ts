import { http } from "@/utils/http";
import { baseUrlApi } from "@/utils/utils.ts";
type Result = {
  success: boolean;
  data: Array<any>;
};

/** 地图数据 */
export const mapJson = (params?: object) => {
  return http.request<Result>("get", baseUrlApi("getMapInfo"), { params });
};
