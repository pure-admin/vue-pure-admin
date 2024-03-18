import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/get-regions",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [
          {
            code: "001",
            name: "中国",
            children: [
              {
                code: "001001",
                name: "北京市",
                children: [
                  {
                    code: "001001001",
                    name: "东城区"
                  },
                  {
                    code: "001001002",
                    name: "西城区"
                  }
                  // 其他区
                ]
              },
              {
                code: "001002",
                name: "上海市",
                children: [
                  {
                    code: "001002001",
                    name: "黄浦区"
                  },
                  {
                    code: "001002002",
                    name: "徐汇区"
                  }
                  // 其他区
                ]
              }
              // 其他城市
            ]
          }
        ]
      };
    }
  }
]);
