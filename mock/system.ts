import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/system",
    method: "post",
    response: () => {
      return {
        code: 0,
        data: {
          list: [
            {
              name: "董事长",
              code: "ceo",
              sort: 1,
              status: 0,
              remark: "",
              id: 1,
              createTime: 1609837428000
            },
            {
              name: "项目经理",
              code: "se",
              sort: 2,
              status: 0,
              remark: "",
              id: 2,
              createTime: 1609837428000
            },
            {
              name: "人力资源",
              code: "hr",
              sort: 3,
              status: 1,
              remark: "",
              id: 3,
              createTime: 1609837428000
            },
            {
              name: "普通员工",
              code: "user",
              sort: 4,
              status: 0,
              remark: "",
              id: 4,
              createTime: 1609837428000
            }
          ],
          total: 4
        },
        msg: ""
      };
    }
  }
] as MockMethod[];
