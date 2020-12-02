// 状态码
export const enum Code {
  failCode = -1,
  successCode = 0
}

// 返回信息
export enum Info {
  "请输入正确的验证码",
  "账号尚未被注册",
  "登录成功",
  "密码错误",
  "密码长度不能小于6位",
  "账号已被注册",
  "账号注册成功",
  "修改成功",
  "删除成功",
  "搜索信息不能为空",
}