import cloud from "@lafjs/cloud";

export default async function (ctx: FunctionContext) {
  const { body } = ctx;
  console.log(cloud);
  interface IRoleProps {
    createTime: number; // 时间戳（毫秒ms）
    updateTime: number;
    id: number;
    name: string;
    code: string;
    status: 0 | 1; // 状态 1 启用 0 停用
    remark: string;
  }
  let list: IRoleProps[] = [
    {
      createTime: 1605456000000, // 时间戳（毫秒ms）
      updateTime: 1684512000000,
      id: 1,
      name: "超级管理员",
      code: "admin",
      status: 1, // 状态 1 启用 0 停用
      remark: "超级管理员拥有最高权限"
    },
    {
      createTime: 1605456000000,
      updateTime: 1684512000000,
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
