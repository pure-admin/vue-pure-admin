import { http } from "../utils/http";

interface jobType extends Promise<any> {
  data?: object;
  code?: number;
  msg?: string;
}

// 获取岗位管理列表
export const getJobList = (data?: object): jobType => {
  return http.request("post", "/system", { data });
};
