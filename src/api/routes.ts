import { http } from "../utils/http";

export const getAsyncRoutes = (data?: object) => {
  return http.request("get", "/getAsyncRoutes", data);
};
