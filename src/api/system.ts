import { http } from "../utils/http";

interface ResponseType extends Promise<any> {
  data?: object;
  code?: number;
  msg?: string;
}

// 获取用户管理列表
export const getUserList = (data?: object): ResponseType => {
  return http.request("post", "/user", { data });
};

// 获取角色管理列表
export const getRoleList = (data?: object): ResponseType => {
  return http.request("post", "/role", { data });
};

// 获取部门管理列表
export const getDeptList = (data?: object): ResponseType => {
  return http.request("post", "/dept", { data });
};
