import { loadEnv } from "@build/utils";
import { LocalStorage, LowSync } from "lowdb";
import { chain, cloneDeep } from "lodash-es";
import { storageLocal } from ".";
import { cookies } from "./cookie";
type Data = {
  database: {};
  sys: {};
};
/**
 * db 数据存储,采用 LocalStorage存储
 */
class DB {
  private db: LowSync<Data>;
  private static env = loadEnv();
  constructor() {
    this.db = new LowSync<Data>(
      new LocalStorage<Data>(`${DB.env.VITE_TITLE}-${DB.env.VITE_VERSION}`)
    );
    this.initialization();
    // @ts-ignore
    this.db.chain = chain(this.db.data);
  }
  private initialization() {
    this.db.data = storageLocal.getItem(
      `${DB.env.VITE_TITLE}-${DB.env.VITE_VERSION}`
    ) || { database: {}, sys: {} };
    this.db.write();
  }
  /**
   * 检查路径是否存在 不存在的话初始化
   * @param param0
   * @returns path
   */
  pathInit({
    dbName = "database",
    path = "",
    user = true,
    validator = () => true,
    defaultValue = ""
  }): string {
    const uuid = cookies.get("uuid") || "ghost-uuid";
    const currentPath = `${dbName}.${user ? `user.${uuid}` : "public"}${
      path ? `.${path}` : ""
    }`;
    // @ts-ignore
    const value = this.db.chain.get(currentPath).value();
    // @ts-ignore
    if (!(value !== undefined && validator(value))) {
      // @ts-ignore
      this.db.chain.set(currentPath, defaultValue).value();
      this.db.write();
    }
    return currentPath;
  }
  /**
   *将数据存储到指定位置 | 路径不存在会自动初始化
   *
   * 效果类似于取值 dbName.path = value
   * @param param0
   */
  dbSet({ dbName = "database", path = "", value = "", user = false }): void {
    const currentPath = this.pathInit({
      dbName,
      path,
      user
    });
    // @ts-ignore
    this.db.chain.set(currentPath, value).value();
    this.db.write();
  }
  /**
   * 获取数据
   *
   * 效果类似于取值 dbName.path || defaultValue
   * @param param0
   * @returns
   */
  dbGet({
    dbName = "database",
    path = "",
    defaultValue = "",
    user = false
  }): any {
    // @ts-ignore
    const values = this.db.chain
      .get(this.pathInit({ dbName, path, user, defaultValue }))
      .value();
    return cloneDeep(values);
  }
}

export const db = new DB();
