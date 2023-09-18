import cloud from "@lafjs/cloud";

export default async function (ctx: FunctionContext) {
  /**@逻辑代码 */
  console.log(ctx, cloud);
  const { body } = ctx;

  /**@逻辑代码 */
  console.log("Hello World");
  if (body.userId) {
    if (body.userId == 1) {
      return {
        success: true,
        data: [1]
      };
    } else if (body.userId == 2) {
      return {
        success: true,
        data: [2]
      };
    }
  } else {
    return {
      success: false,
      data: []
    };
  }
}
