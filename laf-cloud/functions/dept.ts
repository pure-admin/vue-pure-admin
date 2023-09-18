import cloud from "@lafjs/cloud";

export default async function (ctx: FunctionContext) {
  /**@写逻辑 */
  console.log(ctx, "上下文对象");
  console.log(cloud, "云函数");
  /**@写逻辑 */
  console.log("Hello World");
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
