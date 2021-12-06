import { http } from "../utils/http";

export const getAsyncRoutes = (params?: object) => {
  return http.request("get", "/getAsyncRoutes", { params });
};
