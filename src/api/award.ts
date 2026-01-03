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

/** 删除获奖 */
export const deleteAward = (id: string) =>
  http.request<any>("delete", `/award/infos/${id}/`);
