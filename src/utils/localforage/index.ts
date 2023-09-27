import forage from "localforage";
import { LocalForage, ProxyStorage, ExpiresData } from "./types.d";

class StorageProxy implements ProxyStorage {
  protected storage: LocalForage;
  constructor(storageModel) {
    this.storage = storageModel;
    this.storage.config({
      // driver: [forage.LOCALSTORAGE],
      name: "pure-admin"
    });
  }

  /**
   * @description 将对应键名的数据保存到离线仓库
   * @param k 键名
   * @param v 键值
   * @param m 缓存时间（单位`分`，默认`0`分钟，永久缓存）
   */
  public async setItem<T>(k: string, v: T, m = 0): Promise<T> {
    return new Promise((resolve, reject) => {
      this.storage
        .setItem(k, {
          data: v,
          expires: new Date().getTime() + m * 60 * 1000
        })
        .then(value => {
          resolve(value.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * @description 从离线仓库中获取对应键名的值
   * @param k 键名
   */
  public async getItem<T>(k: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.storage
        .getItem(k)
        .then((value: ExpiresData<T>) => {
          const data =
            value.expires > new Date().getTime() || value.expires === 0
              ? value.data
              : null;
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * @description 从离线仓库中删除对应键名的值
   * @param k 键名
   */
  public async removeItem(k: string) {
    return new Promise<void>((resolve, reject) => {
      this.storage
        .removeItem(k)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * @description 从离线仓库中删除所有的键名，重置数据库
   */
  public async clear() {
    return new Promise<void>((resolve, reject) => {
      this.storage
        .clear()
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

/**
 * 二次封装 [localforage](https://localforage.docschina.org/) 支持设置过期时间，提供完整的类型提示
 */
export const localForage = () => new StorageProxy(forage);
