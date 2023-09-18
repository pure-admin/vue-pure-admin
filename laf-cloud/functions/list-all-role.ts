import cloud from "@lafjs/cloud";

export default async function (ctx: FunctionContext) {
  console.log(cloud, ctx);
  return {
    success: true,
    data: [
      { id: 1, name: "超级管理员" },
      { id: 2, name: "普通角色" }
    ]
  };
}
