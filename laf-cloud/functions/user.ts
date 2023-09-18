import cloud from "@lafjs/cloud";
// 用户管理
export default async function (ctx: FunctionContext) {
  console.log(cloud);
  const { body } = ctx.body;
  interface IUserProps {
    username: string;
    nickname: string;
    avatar: string;
    phone: string;
    email: string;
    sex: 0 | 1;
    id: number;
    status: 0 | 1;
    dept: {
      id: number;
      name: string;
    };
    remark: string;
    createTime: number;
  }

  let list: IUserProps[] = [
    {
      username: "admin",
      nickname: "admin",
      avatar: "https://avatars.githubusercontent.com/u/44761321",
      phone: "15888886789",
      email: "@email",
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
      avatar: "https://avatars.githubusercontent.com/u/52823142",
      phone: "18288882345",
      email: "@email",
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
  if (body.phone) list = list.filter(item => item.phone === body.phone);
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
