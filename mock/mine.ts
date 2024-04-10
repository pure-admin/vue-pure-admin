import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/mine",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          avatar: "https://avatars.githubusercontent.com/u/44761321",
          username: "admin",
          nickname: "Coder",
          email: "pureadmin@163.com",
          phone: "15888886789",
          description: "一个热爱开源的前端工程师"
        }
      };
    }
  }
]);
