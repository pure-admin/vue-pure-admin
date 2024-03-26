import { http } from "@/utils/http";

/**动态路由 */
export const getAsyncRoutes = () => {
  return http.request<Array<any>>("get", "/get-async-routes");
};
