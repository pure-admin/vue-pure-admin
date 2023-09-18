import { http } from "@/utils/http";
import { baseUrlApi } from "@/utils/utils.ts";
type Result = {
  success: boolean;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  return http.request<Result>("get", baseUrlApi("getAsyncRoutes"));
};
