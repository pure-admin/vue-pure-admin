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
              createTime: 1609837428000,
              updateTime: 1645477701000,
              creator: "admin",
              updater: "",
              deleted: false,
              tenantId: 1,
              id: 1,
              name: "超级管理员",
              code: "super_admin",
              sort: 1,
              status: 0,
              type: 1,
              remark: "超级管理员",
              dataScope: 1,
              dataScopeDeptIds: null
            },
            {
              createTime: 1609837428000,
              updateTime: 1645477700000,
              creator: "admin",
              updater: "",
              deleted: false,
              tenantId: 1,
              id: 2,
              name: "普通角色",
              code: "common",
              sort: 2,
              status: 0,
              type: 1,
              remark: "普通角色",
              dataScope: 2,
              dataScopeDeptIds: null
            },
            {
              createTime: 1609912175000,
              updateTime: 1647698441000,
              creator: "",
              updater: "1",
              deleted: false,
              tenantId: 1,
              id: 101,
              name: "测试账号",
              code: "test",
              sort: 0,
              status: 0,
              type: 2,
              remark: "132",
              dataScope: 1,
              dataScopeDeptIds: []
            }
          ],
          total: 3
        }
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
            name: "杭州总公司",
            type: 1, // 1 公司 2 分公司 3 部门
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
            name: "郑州分公司",
            type: 2,
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
            type: 3,
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
            type: 3,
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
            name: "深圳分公司",
            type: 2,
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
            type: 3,
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
            type: 3,
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
            type: 3,
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
            type: 3,
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
            type: 3,
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
        ]
      };
    }
  },
  {
    url: "/user",
    method: "post",
    response: () => {
      return {
        code: 0,
        data: {
          list: [
            {
              username: "admin",
              nickname: "admin",
              remark: "管理员",
              deptId: 103,
              postIds: [1],
              mobile: "15888888888",
              sex: 0,
              id: 1,
              status: 0,
              createTime: 1609837427000,
              dept: {
                id: 103,
                name: "研发部门"
              }
            },
            {
              username: "pure",
              nickname: "pure",
              remark: "不要吓我",
              deptId: 104,
              postIds: [1],
              mobile: "15888888888",
              sex: 0,
              id: 100,
              status: 1,
              createTime: 1609981637000,
              dept: {
                id: 104,
                name: "市场部门"
              }
            },
            {
              username: "小姐姐",
              nickname: "girl",
              remark: null,
              deptId: 106,
              postIds: null,
              mobile: "15888888888",
              sex: 1,
              id: 103,
              status: 1,
              createTime: 1610553035000,
              dept: {
                id: 106,
                name: "财务部门"
              }
            },
            {
              username: "小哥哥",
              nickname: "boy",
              remark: null,
              deptId: 107,
              postIds: [],
              mobile: "15888888888",
              sex: 0,
              id: 104,
              status: 0,
              createTime: 1611166433000,
              dept: {
                id: 107,
                name: "运维部门"
              }
            }
          ],
          total: 4
        }
      };
    }
  }
] as MockMethod[];
