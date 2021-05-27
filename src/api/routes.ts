import { http } from "../utils/http";

export const getAsyncRoutes = (data?: object): any => {
  return http.request("get", "/getAsyncRoutes", data);
};
