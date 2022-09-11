import { http } from "../utils/http";

type Result = {
  data?: {
    /** 列表数据 */
    list: Array<any>;
  };
  code?: number;
  msg?: string;
};

/** 卡片列表 */
export const getCardList = (data?: object) => {
  return http.request<Result>("post", "/getCardList", { data });
};
