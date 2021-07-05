import { http } from "../utils/http";

// 获取验证码
export const getVerify = (): any => {
  return http.request("get", "/captcha");
};

// 登录
export const getLogin = (data: object): any => {
  return http.request("post", "/login", data);
};

// 注册
export const getRegist = (data: object): any => {
  return http.request("post", "/register", data);
};
