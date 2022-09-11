import { http } from "../utils/http";

type Result = {
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总数 */
    total: number;
  };
  code?: number;
  msg?: string;
};

/** 获取用户管理列表 */
export const getUserList = (data?: object) => {
  return http.request<Result>("post", "/user", { data });
};

/** 获取角色管理列表 */
export const getRoleList = (data?: object) => {
  return http.request<Result>("post", "/role", { data });
};

/** 获取部门管理列表 */
export const getDeptList = (data?: object) => {
  return http.request<Result>("post", "/dept", { data });
};
