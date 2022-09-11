import { http } from "../utils/http";

type Result = {
  svg?: string;
  code?: number;
  info?: object;
};

/** 获取验证码 */
export const getVerify = () => {
  return http.request<Result>("get", "/captcha");
};

/** 登录 */
export const getLogin = (data: object) => {
  return http.request("post", "/login", { data });
};

/** 刷新token */
export const refreshToken = (data: object) => {
  return http.request("post", "/refreshToken", { data });
};

// export const searchVague = (data: object) => {
//   return http.request("post", "/searchVague", { data });
// };
