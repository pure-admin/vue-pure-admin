import { defineStore } from "pinia";
import { store } from "/@/store";
import { userType } from "./types";
import { router } from "/@/router";
import { storageSession } from "/@/utils/storage";
import { getLogin, refreshToken } from "/@/api/user";
import { getToken, setToken, removeToken } from "/@/utils/auth";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";

const data = getToken();
let token = "";
let username = "";
if (data) {
  const dataJson = JSON.parse(data);
  if (dataJson) {
    token = dataJson?.accessToken;
    username = dataJson?.username ?? "admin";
  }
}

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    token,
    username
  }),
  actions: {
    SET_TOKEN(token) {
      this.token = token;
    },
    SET_NAME(username) {
      this.username = username;
    },
    // 登入
    async loginByUsername(data) {
      return new Promise<void>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            if (data) {
              setToken(data);
              resolve();
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 登出 清空缓存
    logOut() {
      this.token = "";
      this.username = "";
      removeToken();
      storageSession.clear();
      useMultiTagsStoreHook().handleTags("equal", [
        {
          path: "/welcome",
          parentPath: "/",
          meta: {
            title: "menus.hshome",
            icon: "home-filled",
            i18n: true
          }
        }
      ]);
      router.push("/login");
    },
    // 刷新token
    async refreshToken(data) {
      return refreshToken(data).then(res => {
        if (res) {
          setToken(res);
          return res;
        }
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
