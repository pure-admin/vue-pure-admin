import cloud from "@lafjs/cloud";

export default async function (ctx: FunctionContext) {
  /**@写逻辑 */
  console.log(cloud);
  /**@写逻辑 */
  const { refreshToken } = ctx.body;
  if (refreshToken) {
    return {
      success: true,
      data: {
        accessToken: "eyJhbGciOiJIUzUxMiJ9.newAdmin",
        refreshToken: "eyJhbGciOiJIUzUxMiJ9.newAdminRefresh",
        // `expires`选择这种日期格式是为了方便调试，后端直接设置时间戳或许更方便（每次都应该递增）。如果后端返回的是时间戳格式，前端开发请来到这个目录`src/utils/auth.ts`，把第`38`行的代码换成expires = data.expires即可。
        expires: "2023/10/30 23:59:59"
      }
    };
  } else {
    return {
      success: false,
      data: {}
    };
  }
}
