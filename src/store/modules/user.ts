import { defineStore } from "pinia";
import { store } from "/@/store";
import { userType } from "./types";
import { router } from "/@/router";
import { routerArrays } from "/@/layout/types";
import { storageSession } from "@pureadmin/utils";
import { getLogin, refreshTokenApi } from "/@/api/user";
import { UserResult, RefreshTokenResult } from "/@/api/user";
import { getToken, setToken, removeToken } from "/@/utils/auth";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";

const data = getToken();
let token = "";
let refreshToken = "";
let username = "";
let roles = [];
if (data) {
  token = data?.accessToken ?? "";
  refreshToken = data?.refreshToken ?? "";
  username = data?.username ?? "";
  roles = data?.roles ?? [];
}

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    token,
    refreshToken,
    username,
    // 页面级别权限
    roles,
    // 前端生成的验证码（按实际需求替换）
    verifyCode: "",
    // 判断登录页面显示哪个组件（0：登录（默认）、1：手机登录、2：二维码登录、3：注册、4：忘记密码）
    currentPage: 0
  }),
  actions: {
    /** 存储`token` */
    SET_TOKEN(token: string) {
      this.token = token;
    },
    /** 存储`refreshToken` */
    SET_REFRESHTOKEN(token: string) {
      this.refreshToken = token;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储前端生成的验证码 */
    SET_VERIFYCODE(verifyCode: string) {
      this.verifyCode = verifyCode;
    },
    /** 存储登录页面显示哪个组件 */
    SET_CURRENTPAGE(value: number) {
      this.currentPage = value;
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 登出 清空缓存 */
    logOut() {
      this.token = "";
      this.username = "";
      this.roles = [];
      removeToken();
      storageSession.clear();
      useMultiTagsStoreHook().handleTags("equal", routerArrays);
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(data => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
