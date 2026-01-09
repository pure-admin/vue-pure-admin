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

/** 新增等级 */
export const createCompLevel = (data: { name: string }) => {
  return http.request<any>("post", "/comp/levels/", { data });
};

/** 新增类别 */
export const createCompCategory = (data: { name: string }) => {
  return http.request<any>("post", "/comp/categories/", { data });
};

/** 获取当前正在举办的竞赛活动列表 */
export const getActiveEvents = () => {
  return http.request<any[]>("get", "/comp/events/");
};

/** 获取竞赛详细信息 */
export const getCompDetail = (id: number) => {
  return http.request<any>("get", `/comp/info/${id}/`);
};

/** 新增竞赛活动 */
export const createEvent = (data: any) => {
  return http.request<any>("post", "/comp/events/", { data });
};

/** 更新竞赛活动 (假设支持 PATCH) */
export const updateEvent = (id: number, data: any) => {
  return http.request<any>("patch", `/comp/events/${id}/`, { data });
};

/** 状态推进接口载荷类型 */
export type NextStageParams = {
  current_status: string;
  detail: string;
};

/** 1. 基础 API 定义：更新赛事阶段 */
export const updateEventStage = (id: number, data: NextStageParams) => {
  return http.request<any>("post", `/comp/events/${id}/next-stage/`, { data });
};

/** 2. 导出状态顺序常量，方便全项目复用 */
export const STAGE_MAP = {
  registration: {
    next: "screening",
    label: "初筛中",
    desc: "推进后将截止报名并进入初筛阶段"
  },
  screening: {
    next: "ongoing",
    label: "比赛进行中",
    desc: "推进后将进入比赛进行阶段"
  },
  ongoing: {
    next: "awarding",
    label: "评奖/审核中",
    desc: "推进后将进入评奖审核阶段"
  },
  awarding: {
    next: "archived",
    label: "已归档",
    desc: "推进后赛事将归档，不可再修改"
  }
} as const;

/** 3. 与之对应的团队状态常量，方便全项目复用 */
export const TEAM_STATUS_CONFIG = {
  draft: { label: "草稿", color: "info", canEdit: true },
  submitted: { label: "已报名", color: "warning", canEdit: false },
  shortlisted: { label: "入围", color: "success", canEdit: false },
  rejected: { label: "驳回", color: "danger", canEdit: true }, // 被驳回后允许修改重新提交
  awarded: { label: "已获奖", color: "success", canEdit: false },
  ended: { label: "未获奖", color: "info", canEdit: false }
};

/* 用于获取赛事当前的 status (如 registration, ongoing, awarding 等)
 */
export const getEventDetail = (id: number) => {
  return http.request<any>("get", `/comp/events/${id}/`);
};
