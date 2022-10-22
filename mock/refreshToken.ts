import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/refreshToken",
    method: "post",
    response: ({ body }) => {
      if (body.refreshToken) {
        return {
          success: true,
          data: {
            accessToken: "eyJhbGciOiJIUzUxMiJ9.admin",
            refreshToken: "eyJhbGciOiJIUzUxMiJ9.adminRefresh",
            expires: "2022/10/23 02:00:00"
          }
        };
      } else {
        return {
          success: false,
          data: {}
        };
      }
    }
  }
] as MockMethod[];
