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
export const getAwardList = () => http.request<any[]>("get", "/award/infos/");

/** 创建获奖信息（带证书文件） */
export const createAwardWithCert = (data: FormData) =>
  http.request<any>("post", "/award/infos/", {
    data,
    headers: { "Content-Type": "multipart/form-data" }
  });

/** 根据用户ID获取获奖信息 */
export const getAwardsByUserId = (userId: string) => {
  return http.request<any[]>("get", "/award/infos/", {
    params: { user_id: userId }
  });
};

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
  return http.request<any[]>("get", "/award/infos/my-awards/");
};

/** 获取获奖统计数据 */
export const getAwardStatistics = () => {
  return http.request<any>("get", "/award/statistics/");
};
