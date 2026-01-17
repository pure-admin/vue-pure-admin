import { http } from "@/utils/http";

// src/api/award.ts
export interface AwardInfo {
  id?: string;
  competition: number;
  participants: string[];
  instructors: string[];
  award_level: string;
  award_date: string;
  cert_no: string;
}

/** 获取获奖列表 */
export const getAwardList = (params?: any) =>
  http.request<any[]>("get", "/award/infos/", { params });

// 之前的方法可以简化为调用 getAwardList
export const getAwardsByUserId = (userId: string) => {
  return getAwardList({ user_id: userId });
};

/** 创建获奖信息（带证书文件） */
export const createAwardWithCert = (data: FormData) =>
  http.request<any>("post", "/award/infos/", {
    data,
    headers: { "Content-Type": "multipart/form-data" }
  });

/** 删除获奖 */
export const deleteAward = (id: string) =>
  http.request<any>("delete", `/award/infos/${id}/`);

/** 获取报表数据 */
export const getAwardReport = (params: {
  group_by: string;
  start_date?: string;
  end_date?: string;
}) => {
  return http.request<any[]>("get", "/award/report/", { params });
};

/** 获取当前登录用户的获奖记录 */
export const getMyAwards = () => {
  return http.request<any[]>("get", "/award/infos/");
};

/** 获取获奖统计数据 */
export const getAwardStatistics = () => {
  return http.request<any>("get", "/award/statistics/");
};

// 批量导入api
/** 上传文件 */
export const uploadImportFile = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return http.request<any>("post", "/award/import/upload/", {
    data: formData,
    headers: { "Content-Type": "multipart/form-data" }
  });
};

/** 获取任务下的暂存数据项 */
export const getImportItems = (taskId: string | number) => {
  return http.request<any>("get", `/award/import/${taskId}/items/`);
};

/** 更新单行暂存数据 (纠错) */
export const updateImportItem = (taskId: number, data: any) => {
  return http.request<any>("patch", `/award/import/${taskId}/update-item/`, {
    data
  });
};

/** 提交入库 */
export const commitImportTask = (taskId: number) => {
  return http.request<any>("post", `/award/import/${taskId}/commit/`);
};

/** 获取导入任务状态 (轮询用) */
export const getImportStatus = (taskId: number) => {
  return http.request<{ status: string; progress: number }>(
    "get",
    `/award/import/${taskId}/status/`
  );
};
