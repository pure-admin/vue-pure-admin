import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/login",
    method: "post",
    response: ({ body }) => {
      if (body.username === "admin") {
        return {
          username: "admin",
          expires: 24 * 60 * 60,
          accessToken: "eyJhbGciOiJIUzUxMiJ9.admin"
        };
      } else {
        return {
          username: "test",
          expires: 24 * 60 * 60,
          accessToken: "eyJhbGciOiJIUzUxMiJ9.test"
        };
      }
    }
  }
] as MockMethod[];
