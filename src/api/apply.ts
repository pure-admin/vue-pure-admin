import { http } from "@/utils/http";

/** 提交获奖申请的 Payload 结构 */
export interface AwardPayload {
  comp_id?: number | null; // 如果是新竞赛，这个字段传 null 或不传
  comp_title: string;
  year: number;
  description: string;
  uri: string;
  category_id: number;
  level_id: number;
  participant_ids: string[];
  instructor_ids: string[];
}

/** 提交申请接口 */
export const createAwardApply = (data: FormData) => {
  return http.request<any>("post", "/apply/award-apply/", {
    data,
    headers: {
      // Axios 通常会自动处理 FormData 的 Content-Type，但在某些封装中显式声明更安全
      "Content-Type": "multipart/form-data"
    }
  });
};

/** 搜索竞赛信息 */
export const searchCompetitions = (keyword: string) => {
  return http.request<any[]>("get", "/comp/info/", {
    params: { search: keyword }
  });
};

/** 申请记录条目类型 */
export interface AwardApplyItem {
  id: number;
  cert_image: string;
  cert_no: string;
  award_level: string;
  award_date: string;
  payload: AwardPayload; // 复用之前的 AwardPayload 类型
  status: "pending" | "rejected" | "approved";
  created_at: string;
  applicant: number;
}

/** 获取所有申请记录 */
export const getAwardApplies = () => {
  return http.request<AwardApplyItem[]>("get", "/apply/award-apply/");
};

/** 审批通过 */
export const approveAward = (id: number) => {
  return http.request<any>("post", `/apply/award-approve/${id}/do_approve/`);
};

/** 审批拒绝 */
export const rejectAward = (id: number, remark: string) => {
  return http.request<any>("post", `/apply/award-approve/${id}/do_reject/`, {
    data: { remark }
  });
};

/** 获取待审批列表 */
export const getApproveList = () => {
  return http.request<AwardApplyItem[]>("get", "/apply/award-approve/");
};
