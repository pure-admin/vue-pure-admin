// src/api/user.ts
import { http } from "@/utils/http";

/** 登录接口返回类型 */
export type UserResult = {
  access: string;
  refresh: string;
  user_id: string;
  roles: Array<string>;
};

/** 刷新 Token 接口返回类型 */
export type RefreshTokenResult = {
  access: string; // 你的后端刷新后返回的是 { "access": "..." }
};

/** 登录接口 */
export const getLogin = (data: object) => {
  return http.request<UserResult>("post", "/user/login/", { data });
};

/** 刷新Token接口 */
export const refreshTokenApi = (data: object) => {
  // data 传入的是 { refresh: "..." }
  return http.request<RefreshTokenResult>("post", "/user/token/refresh/", {
    data
  });
};

/** 获取个人资料 */
export const getUserProfile = () => {
  return http.request<any>("get", "/user-profile/view/");
};

/** 更新个人资料 */
export const updateUserProfile = (data: any) => {
  return http.request<any>("put", "/user-profile/view/", { data });
};

/** 修改密码 */
export const changePassword = (data: any) => {
  return http.request<any>("put", "/user/change-password/", { data });
};

/** 注册接口返回类型 */
export type RegisterResult = {
  message: string;
  user_id: string;
  roles: Array<string>;
};

/** 用户注册接口 */
export const registerUser = (data: object) => {
  return http.request<RegisterResult>("post", "/user/register/", { data });
};
/** 统计信息类型 */
export type RoleStat = {
  name: string;
  user_count: number;
};

export type UserStatistics = {
  role_stats: RoleStat[];
  unassigned_stats: RoleStat;
  total_users: number;
};

/** 获取用户统计数据 */
export const getUserStats = () => {
  return http.request<UserStatistics>("get", "/user/statistic/");
};

/** 搜索用户 Profile 结果类型 */
export interface UserProfileSearchItem {
  user_id: string;
  real_name: string;
  phone: string | null;
  email: string | null;
  college: string | null; // 确保有这一行
  department: string | null;
  role_name: string;
  major?: string | null;
  clazz?: string | null;
  title?: string | null;
}

/** 按真实姓名搜索用户 */
export const searchUserByName = (realName: string) => {
  return http.request<UserProfileSearchItem[]>("get", "/user-profile/search/", {
    params: { real_name: realName }
  });
};

/** 通过user_id获取用户详细信息 */
export const searchUserByID = (userId: string) => {
  return http.request<UserProfileSearchItem[]>(
    "get",
    `/user-profile/by-user-id/${userId}/`
  );
};

/** 更新用户账户信息（密码和角色） */
export const updateUserAccount = (
  userId: string,
  data: { password?: string; re_password?: string; groups?: number[] }
) => {
  return http.request<any>("patch", `/user/users/${userId}/`, { data });
};

/** 角色项类型 */
export type RoleItem = {
  id: number;
  name: string;
};

/** 获取所有可用角色列表 */
export const getAllRoles = () => {
  return http.request<RoleItem[]>("get", "/user/roles/");
};

export interface UserListItem {
  user_id: string;
  real_name: string;
  phone: string | null;
  email: string | null;
  college: string | null; // 确保有这一行
  department: string | null;
  role_name: string;
  major?: string | null;
  clazz?: string | null;
  title?: string | null;
}

export interface UserListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserListItem[];
}

// 修改获取用户列表的函数
export const getUsers = (params: any) => {
  return http.request<UserListResponse>("get", "/user-profile/list/", {
    params
  });
};

// 新增删除用户函数
export const deleteUser = (userId: string) => {
  return http.request("delete", `/user/users/${userId}/`);
};

// 批量导入用户接口
export const importUsers = (data: FormData) => {
  return http.request<any>("post", "/user/import-users/", {
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
// 获取进度
export const getImportStatus = (taskId: string) => {
  return http.request<any>("get", `/user/import-status/${taskId}/`);
};
