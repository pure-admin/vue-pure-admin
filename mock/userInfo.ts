import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/get-user-info",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          avatarUrl: "https://avatars.githubusercontent.com/u/44761321",
          nickName: "企丸丸",
          introduce: "我是幻兽帕鲁里的明星",
          regionCode: "001002001",
          address: "冰鸟密域祭坛地下城",
          userName: "admin"
        }
      };
    }
  }
]);
