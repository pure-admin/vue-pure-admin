import { http } from "@/utils/http";

/** * 检查报名状态
 * 返回: { is_leader: boolean, is_member: boolean, can_create: boolean }
 */
export const checkMyParticipation = (eventId: number) => {
  return http.request<any>("get", "/team/info/my-participation/", {
    params: { event: eventId }
  });
};

/** 创建团队（报名） */
export const createTeam = (data: {
  event: number;
  name: string;
  members?: string[]; // 建议加上，支持创建时录入成员学号
  teachers?: string[];
}) => {
  return http.request<any>("post", "/team/info/", { data });
};

/** * 更新团队信息 (update-info)
 * 修正点：根据数据类型动态处理 Content-Type
 */
export const updateTeamInfo = (id: number, data: any) => {
  const isFormData = data instanceof FormData;
  return http.request<any>("patch", `/team/info/${id}/update-info/`, {
    data,
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {}
  });
};

/** * 专门的文件/证书上传接口 (upload-files)
 * 对应你后端定义的 @action upload_files
 * 用于：队长补传作品 works 或获奖证书 attachment
 */
export const uploadTeamFiles = (id: number, data: FormData) => {
  return http.request<any>("patch", `/team/info/${id}/upload-files/`, {
    data,
    headers: { "Content-Type": "multipart/form-data" }
  });
};

/** 获取团队详情 */
export const getTeamDetail = (id: number) => {
  return http.request<any>("get", `/team/info/${id}/`);
};

/** 获取团队列表（学生看自己，管理员看全部）*/
export const getTeamList = (params?: any) => {
  return http.request<any[]>("get", "/team/info/", { params });
};

/** 初筛审核接口 (管理员专用) */
export const reviewShortlist = (
  id: number,
  data: { action: "approve" | "reject"; reason?: string }
) => {
  return http.request<any>("post", `/team/info/${id}/review-shortlist/`, {
    data
  });
};

/** 获奖审核接口 (管理员专用) */
export const reviewAward = (
  id: number,
  data: { action: "award" | "finish" }
) => {
  return http.request<any>("post", `/team/info/${id}/review-award/`, { data });
};

/** * 提交报名申请 (从 draft/rejected 流转至 submitted)
 */
export const submitTeamRegistration = (id: number) => {
  return http.request<any>("post", `/team/info/${id}/submit-registration/`);
};
