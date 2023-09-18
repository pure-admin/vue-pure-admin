import cloud from "@lafjs/cloud";
const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const { username, password } = ctx.body;

  // 查询账号密码
  const result = await db
    .collection("account")
    .where({
      username,
      password
    })
    .get();
  if (result.data && result.data.length > 0) {
    console.log("进入了");
    const { data } = result;
    // 使用对象解构和剩余操作符来排除密码字段
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const [{ password, ...userWithoutPassword }] = data;
    return {
      success: true,
      data: { ...userWithoutPassword }
    };
  } else {
    return {
      success: false,
      msg: "账号或密码错误"
    };
  }
}
