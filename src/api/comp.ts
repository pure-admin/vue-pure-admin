import { http } from "@/utils/http";

export type CompInfo = {
  id?: number;
  title: string;
  description: string;
  year: number;
  category: number;
  uri: string;
  level: number;
  category_name?: string;
  level_name?: string;
};

/** 获取竞赛列表（假设支持分页或查询） */
export const getCompList = (params?: object) => {
  return http.request<any>("get", "/comp/info/", { params });
};

/** 新建竞赛 */
export const createComp = (data: CompInfo) => {
  return http.request<CompInfo>("post", "/comp/info/", { data });
};

/** 更新竞赛 */
export const updateComp = (id: number, data: Partial<CompInfo>) => {
  return http.request<CompInfo>("patch", `/comp/info/${id}/`, { data });
};

/** 删除竞赛 */
export const deleteComp = (id: number) => {
  return http.request<any>("delete", `/comp/info/${id}/`);
};

/** 获取等级列表（用于下拉框） */
export const getCompLevels = () => {
  return http.request<any>("get", "/comp/levels/");
};

/** 获取类别列表（用于下拉框） */
export const getCompCategories = () => {
  return http.request<any>("get", "/comp/categories/");
};
