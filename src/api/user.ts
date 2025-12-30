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
  return http.request<UserResult>("post", "/api/user/login/", { data });
};

/** 刷新Token接口 */
export const refreshTokenApi = (data: object) => {
  // data 传入的是 { refresh: "..." }
  return http.request<RefreshTokenResult>("post", "/api/user/token/refresh/", {
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
