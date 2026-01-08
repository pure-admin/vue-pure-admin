import { http } from "@/utils/http";

/** 检查报名状态 */
export const checkMyParticipation = (eventId: number) => {
  return http.request<any>("get", "/team/info/my-participation/", {
    params: { event: eventId }
  });
};

/** 创建团队（报名） */
export const createTeam = (data: { event: number; name: string }) => {
  return http.request<any>("post", "/team/info/", { data });
};

/** 更新团队信息（包含成员、老师、文件等） */
export const updateTeamInfo = (id: number, data: FormData | object) => {
  return http.request<any>("patch", `/team/info/${id}/update-info/`, {
    data,
    headers: { "Content-Type": "multipart/form-data" } // 只有传 FormData 时才需要
  });
};

/** 获取我的相关的团队列表或者所有团队信息（管理员）*/
export const getMyTeams = () => {
  return http.request<any[]>("get", "/team/info/");
};

/** 初筛审核接口 (用于 screening 阶段) */
export const reviewShortlist = (
  id: number,
  data: { action: "approve" | "reject"; reason?: string }
) => {
  return http.request<any>("post", `/team/info/${id}/review-shortlist/`, {
    data
  });
};

/** 获奖审核接口 (用于 awarding 阶段) */
export const reviewAward = (
  id: number,
  data: { action: "award" | "finish" }
) => {
  return http.request<any>("post", `/team/info/${id}/review-award/`, { data });
};
