import Cookies from "js-cookie";
import { useUserStoreHook } from "/@/store/modules/user";

const TokenKey = "authorized-token";

type paramsMapType = {
  name: string;
  roles: Array<string>;
  expires: number;
  accessToken: string;
};

/** 获取`token` */
export function getToken() {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return Cookies.get("authorized-token");
}

/** 设置`token`以及过期时间（`cookies`、`sessionStorage`各一份），后端需要将用户信息、权限、`token`以及过期时间都返回给前端，过期时间主要用于刷新`token` */
export function setToken(data) {
  const { accessToken, expires, name, roles } = data;
  // 提取关键信息进行存储
  const paramsMap: paramsMapType = {
    name,
    roles,
    expires: Date.now() + parseInt(expires),
    accessToken
  };
  const dataString = JSON.stringify(paramsMap);
  useUserStoreHook().SET_TOKEN(accessToken);
  useUserStoreHook().SET_NAME(name);
  useUserStoreHook().SET_ROLES(roles);
  expires > 0
    ? Cookies.set(TokenKey, dataString, {
        expires: expires / 86400000
      })
    : Cookies.set(TokenKey, dataString);
  sessionStorage.setItem(TokenKey, dataString);
}

/** 删除`token` */
export function removeToken() {
  Cookies.remove(TokenKey);
  sessionStorage.removeItem(TokenKey);
}
