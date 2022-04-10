import { http } from "../utils/http";

interface postType extends Promise<any> {
  data?: object;
  code?: number;
  msg?: string;
}

// 获取岗位管理列表
export const getPostList = (data?: object): postType => {
  return http.request("post", "/system", { data });
};

// 获取部门管理列表
export const getDeptList = (data?: object): postType => {
  return http.request("post", "/dept", { data });
};
