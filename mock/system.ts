import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/role",
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
  },
  {
    url: "/dept",
    method: "post",
    response: () => {
      return {
        code: 0,
        data: [
          {
            name: "pure-admin",
            parentId: 0,
            sort: 0,
            leaderUserId: 1,
            phone: "15888888888",
            email: "ry@qq.com",
            status: 0,
            id: 100,
            createTime: 1609837427000,
            remark: "备注、备注、备注、备注、备注、备注、备注"
          },
          {
            name: "深圳总公司",
            parentId: 100,
            sort: 1,
            leaderUserId: 104,
            phone: "15888888888",
            email: "ry@qq.com",
            status: 0,
            id: 101,
            createTime: 1609837427000,
            remark: "备注、备注、备注、备注、备注、备注、备注"
          },
          {
            name: "研发部门",
            parentId: 101,
            sort: 1,
            leaderUserId: 104,
            phone: "15888888888",
            email: "ry@qq.com",
            status: 0,
            id: 103,
            createTime: 1609837427000,
            remark: "备注、备注、备注、备注、备注、备注、备注"
          },
          {
            name: "市场部门",
            parentId: 102,
            sort: 1,
            leaderUserId: null,
            phone: "15888888888",
            email: "ry@qq.com",
            status: 0,
            id: 108,
            createTime: 1609837427000,
            remark: "备注、备注、备注、备注、备注、备注、备注"
          },
          {
            name: "长沙分公司",
            parentId: 100,
            sort: 2,
            leaderUserId: null,
            phone: "15888888888",
            email: "ry@qq.com",
            status: 0,
            id: 102,
            createTime: 1609837427000,
            remark: "备注、备注、备注、备注、备注、备注、备注"
          },
          {
            name: "市场部门",
            parentId: 101,
            sort: 2,
            leaderUserId: null,
            phone: "15888888888",
            email: "ry@qq.com",
            status: 1,
            id: 104,
            createTime: 1609837427000,
            remark: "备注、备注、备注、备注、备注、备注、备注"
          },
          {
            name: "财务部门",
            parentId: 102,
            sort: 2,
            leaderUserId: null,
            phone: "15888888888",
            email: "ry@qq.com",
            status: 0,
            id: 109,
            createTime: 1609837427000,
            remark: "备注、备注、备注、备注、备注、备注、备注"
          },
          {
            name: "测试部门",
            parentId: 101,
            sort: 3,
            leaderUserId: null,
            phone: "15888888888",
            email: "ry@qq.com",
            status: 0,
            id: 105,
            createTime: 1609837427000,
            remark: "备注、备注、备注、备注、备注、备注、备注"
          },
          {
            name: "财务部门",
            parentId: 101,
            sort: 4,
            leaderUserId: 103,
            phone: "15888888888",
            email: "ry@qq.com",
            status: 1,
            id: 106,
            createTime: 1609837427000,
            remark: "备注、备注、备注、备注、备注、备注、备注"
          },
          {
            name: "运维部门",
            parentId: 101,
            sort: 5,
            leaderUserId: null,
            phone: "15888888888",
            email: "ry@qq.com",
            status: 0,
            id: 107,
            createTime: 1609837427000,
            remark: "备注、备注、备注、备注、备注、备注、备注"
          }
        ],
        msg: ""
      };
    }
  }
] as MockMethod[];
