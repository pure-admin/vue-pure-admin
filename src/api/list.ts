import { http } from "../utils/http";

interface postType extends Promise<any> {
  data?: object;
  code?: number;
  msg?: string;
}

// 卡片列表
export const getCardList = (data?: object): postType => {
  return http.request("post", "/getCardList", { data });
};
