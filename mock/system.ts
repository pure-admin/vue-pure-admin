import { MockMethod } from "vite-plugin-mock";

export default [
  // 用户
  {
    url: "/user",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          username: "admin",
          nickname: "admin",
          avatar:
            "https://yiming_chang.gitee.io/vue-pure-admin/static/jpg/user.jpg",
          mobile: "15888886789",
          sex: 0,
          id: 1,
          status: 1,
          dept: {
            // 部门id
            id: 103,
            // 部门名称
            name: "研发部门"
          },
          remark: "管理员",
          createTime: 1605456000000
        },
        {
          username: "common",
          nickname: "common",
          avatar:
            "https://yiming_chang.gitee.io/vue-pure-admin/static/png/avatar.png",
          mobile: "18288882345",
          sex: 1,
          id: 2,
          status: 1,
          dept: {
            id: 105,
            name: "测试部门"
          },
          remark: "普通用户",
          createTime: 1605456000000
        }
      ];
      list = list.filter(item => item.username.includes(body?.username));
      list = list.filter(item =>
        String(item.status).includes(String(body?.status))
      );
      if (body.mobile) list = list.filter(item => item.mobile === body.mobile);
      if (body.deptId) list = list.filter(item => item.dept.id === body.deptId);
      return {
        success: true,
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      };
    }
  },
  // 角色
  {
    url: "/role",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          createTime: 1605456000000, // 时间戳（毫秒ms）
          updateTime: 1684512000000,
          creator: "admin",
          id: 1,
          name: "超级管理员",
          code: "admin",
          status: 1, // 状态 1 启用 0 停用
          remark: "超级管理员拥有最高权限"
        },
        {
          createTime: 1605456000000,
          updateTime: 1684512000000,
          creator: "admin",
          id: 2,
          name: "普通角色",
          code: "common",
          status: 1,
          remark: "普通角色拥有部分权限"
        }
      ];
      list = list.filter(item => item.name.includes(body?.name));
      list = list.filter(item =>
        String(item.status).includes(String(body?.status))
      );
      if (body.code) list = list.filter(item => item.code === body.code);
      return {
        success: true,
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      };
    }
  },
  // 部门
  {
    url: "/dept",
    method: "post",
    response: () => {
      return {
        success: true,
        data: [
          {
            name: "杭州总公司",
            parentId: 0,
            id: 100,
            sort: 0,
            phone: "15888888888",
            principal: "@cname()",
            email: "@email",
            status: 1, // 状态 1 启用 0 停用
            type: 1, // 1 公司 2 分公司 3 部门
            createTime: 1605456000000,
            remark: "@cparagraph(1, 3)"
          },
          {
            name: "郑州分公司",
            parentId: 100,
            id: 101,
            sort: 1,
            phone: "15888888888",
            principal: "@cname()",
            email: "@email",
            status: 1,
            type: 2,
            createTime: 1605456000000,
            remark: "@cparagraph(1, 3)"
          },
          {
            name: "研发部门",
            parentId: 101,
            id: 103,
            sort: 1,
            phone: "15888888888",
            principal: "@cname()",
            email: "@email",
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "@cparagraph(1, 3)"
          },
          {
            name: "市场部门",
            parentId: 102,
            id: 108,
            sort: 1,
            phone: "15888888888",
            principal: "@cname()",
            email: "@email",
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "@cparagraph(1, 3)"
          },
          {
            name: "深圳分公司",
            parentId: 100,
            id: 102,
            sort: 2,
            phone: "15888888888",
            principal: "@cname()",
            email: "@email",
            status: 1,
            type: 2,
            createTime: 1605456000000,
            remark: "@cparagraph(1, 3)"
          },
          {
            name: "市场部门",
            parentId: 101,
            id: 104,
            sort: 2,
            phone: "15888888888",
            principal: "@cname()",
            email: "@email",
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "@cparagraph(1, 3)"
          },
          {
            name: "财务部门",
            parentId: 102,
            id: 109,
            sort: 2,
            phone: "15888888888",
            principal: "@cname()",
            email: "@email",
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "@cparagraph(1, 3)"
          },
          {
            name: "测试部门",
            parentId: 101,
            id: 105,
            sort: 3,
            phone: "15888888888",
            principal: "@cname()",
            email: "@email",
            status: 0,
            type: 3,
            createTime: 1605456000000,
            remark: "@cparagraph(1, 3)"
          },
          {
            name: "财务部门",
            parentId: 101,
            id: 106,
            sort: 4,
            phone: "15888888888",
            principal: "@cname()",
            email: "@email",
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "@cparagraph(1, 3)"
          },
          {
            name: "运维部门",
            parentId: 101,
            id: 107,
            sort: 5,
            phone: "15888888888",
            principal: "@cname()",
            email: "@email",
            status: 0,
            type: 3,
            createTime: 1605456000000,
            remark: "@cparagraph(1, 3)"
          }
        ]
      };
    }
  }
] as MockMethod[];
