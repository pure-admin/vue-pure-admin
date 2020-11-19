/**
 * 处理token的工具
 */

// 存
export function setToken(token: string): void {
  token && sessionStorage.setItem("Token", token)
}

// 取
export function getToken(): string {
  let token = sessionStorage.getItem("Token") && JSON.parse(sessionStorage.getItem("Token") || "");
  return token;
}

// 删
export function delToken(): void {
  sessionStorage.removeItem("Token");
}