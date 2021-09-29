import { loadEnv } from "@build/utils";
import { merge } from "lodash-es";
import tsCookies from "typescript-cookie/dist/src/compat";

class Cookies {
  private static env = loadEnv();
  constructor() {}
  /**
   *  存储 cookie 值
   * @param name
   * @param value
   * @param cookieSetting
   */
  set(name = "default", value = "", cookieSetting = {}) {
    const currentCookieSetting = {
      expires: 1
    };
    merge(currentCookieSetting, cookieSetting);
    tsCookies.set(
      `${Cookies.env.VITE_TITLE}-${Cookies.env.VITE_VERSION}-${name}`,
      value,
      currentCookieSetting
    );
  }
  /**
   * 拿到 cookie 值
   * @param name
   * @returns
   */
  get(name = "default") {
    return tsCookies.get(
      `${Cookies.env.VITE_TITLE}-${Cookies.env.VITE_VERSION}-${name}`
    );
  }
  /**
   * 拿到 cookie 全部的值
   * @returns
   */
  getAll() {
    return tsCookies.get();
  }
  /**
   * 删除 cookie
   * @param name
   */
  remove(name = "default") {
    tsCookies.remove(
      `${Cookies.env.VITE_TITLE}-${Cookies.env.VITE_VERSION}-${name}`
    );
  }
}

export const cookies = new Cookies();
