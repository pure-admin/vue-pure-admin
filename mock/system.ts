import { MockMethod } from "vite-plugin-mock";

interface DepartData {
  name: string;
  parentId: number;
  id: number;
  sort: number;
  phone: string;
  principal: string;
  email: string;
  status: 0 | 1; // 状态 1 启用 0 停用
  type: 1 | 2 | 3; // 1 公司 2 分公司 3 部门
  createTime: number;
  remark: string;
}

const deptList: Array<DepartData> = [
  {
    name: "杭州总公司",
    parentId: 0,
    id: 100,
    sort: 0,
    phone: "1@cword('358',1)@string('number',9)",
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
    phone: "1@cword('358',1)@string('number',9)",
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
    phone: "1@cword('358',1)@string('number',9)",
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
    phone: "1@cword('358',1)@string('number',9)",
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
    phone: "1@cword('358',1)@string('number',9)",
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
    phone: "1@cword('358',1)@string('number',9)",
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
    phone: "1@cword('358',1)@string('number',9)",
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
    phone: "1@cword('358',1)@string('number',9)",
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
    phone: "1@cword('358',1)@string('number',9)",
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
    phone: "1@cword('358',1)@string('number',9)",
    principal: "@cname()",
    email: "@email",
    status: 0,
    type: 3,
    createTime: 1605456000000,
    remark: "@cparagraph(1, 3)"
  }
];

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export default [
  // 用户
  {
    url: "/user",
    method: "get",
    response: ({ query }) => {
      const deptId = query?.deptId ?? null;
      const status =
        query?.status in ["0", "1"] ? parseInt(query.status) : null;
      const list = [];
      const currentDept = deptId ? deptList.find(d => d.id == deptId) : null;
      const total = 2 + getRandomInt(8);
      for (let i = 0; i < total; i++) {
        const dept: DepartData =
          currentDept ?? deptList[getRandomInt(deptList.length - 1)];
        const item = {
          username: "@first",
          nickname: "@cname",
          remark: "@ctitle",
          deptId: dept.id,
          postIds: [1],
          mobile: "1@cword('358',1)@string('number',9)",
          sex: "@pick([0,1])",
          id: "@integer(1, 1000)",
          status: status ?? "@pick([0,1])",
          createTime: "@pick([2020,2021,2022])@datetime('-MM-dd HH:mm:ss')",
          dept: {
            id: dept.id,
            name: dept.name
          }
        };
        list.push(item);
      }
      return {
        success: true,
        data: {
          list,
          total
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
    method: "get",
    response: () => {
      return {
        success: true,
        data: deptList
      };
    }
  }
] as MockMethod[];
