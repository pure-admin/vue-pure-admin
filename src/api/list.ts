import { http } from "@/utils/http";
import { baseUrlApi } from "@/utils/utils.ts";
type Result = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
  };
};

/** 卡片列表 */
export const getCardList = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("getCardList"), { data });
};

/** 版本日志 */
export const getReleases = () => {
  return http.request<Result>("get", baseUrlApi("releases"));
};
