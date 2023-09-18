import { http } from "@/utils/http";
import { baseUrlApi } from "@/utils/utils.ts";
type Result = {
  success: boolean;
  data?: Array<any>;
};

type ResultTable = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

/** 获取用户管理列表 */
export const getUserList = (data?: object) => {
  return http.request<ResultTable>("post", baseUrlApi("user"), { data });
};

/** 用户管理-获取所有角色列表 */
export const getAllRoleList = () => {
  return http.request<Result>("get", baseUrlApi("list-all-role"));
};

/** 用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("list-role-ids"), { data });
};

/** 获取角色管理列表 */
export const getRoleList = (data?: object) => {
  return http.request<ResultTable>("post", baseUrlApi("role"), { data });
};

/** 获取部门管理列表 */
export const getDeptList = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("dept"), { data });
};
