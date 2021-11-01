import Axios, {
  AxiosRequestConfig,
  CancelTokenStatic,
  AxiosInstance
} from "axios";

import NProgress from "../progress";

import { genConfig } from "./config";

import { transformConfigByMethod } from "./utils";

import {
  cancelTokenType,
  RequestMethods,
  EnclosureHttpRequestConfig,
  EnclosureHttpResoponse,
  EnclosureHttpError
} from "./types.d";

class EnclosureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }
  // 初始化配置对象
  private static initConfig: EnclosureHttpRequestConfig = {};

  // 保存当前Axios实例对象
  private static axiosInstance: AxiosInstance = Axios.create(genConfig());

  // 保存 EnclosureHttp实例
  private static EnclosureHttpInstance: EnclosureHttp;

  // axios取消对象
  private CancelToken: CancelTokenStatic = Axios.CancelToken;

  // 取消的凭证数组
  private sourceTokenList: Array<cancelTokenType> = [];

  // 记录当前这一次cancelToken的key
  private currentCancelTokenKey = "";

  public get cancelTokenList(): Array<cancelTokenType> {
    return this.sourceTokenList;
  }

  // eslint-disable-next-line class-methods-use-this
  public set cancelTokenList(value) {
    throw new Error("cancelTokenList不允许赋值");
  }

  /**
   * @description 私有构造不允许实例化
   * @returns void 0
   */
  // constructor() {}

  /**
   * @description 生成唯一取消key
   * @param config axios配置
   * @returns string
   */
  // eslint-disable-next-line class-methods-use-this
  private static genUniqueKey(config: EnclosureHttpRequestConfig): string {
    return `${config.url}--${JSON.stringify(config.data)}`;
  }

  /**
   * @description 取消重复请求
   * @returns void 0
   */
  private cancelRepeatRequest(): void {
    const temp: { [key: string]: boolean } = {};

    this.sourceTokenList = this.sourceTokenList.reduce<Array<cancelTokenType>>(
      (res: Array<cancelTokenType>, cancelToken: cancelTokenType) => {
        const { cancelKey, cancelExecutor } = cancelToken;
        if (!temp[cancelKey]) {
          temp[cancelKey] = true;
          res.push(cancelToken);
        } else {
          cancelExecutor();
        }
        return res;
      },
      []
    );
  }

  /**
   * @description 删除指定的CancelToken
   * @returns void 0
   */
  private deleteCancelTokenByCancelKey(cancelKey: string): void {
    this.sourceTokenList =
      this.sourceTokenList.length < 1
        ? this.sourceTokenList.filter(
            cancelToken => cancelToken.cancelKey !== cancelKey
          )
        : [];
  }

  /**
   * @description 拦截请求
   * @returns void 0
   */

  private httpInterceptorsRequest(): void {
    EnclosureHttp.axiosInstance.interceptors.request.use(
      (config: EnclosureHttpRequestConfig) => {
        const $config = config;
        NProgress.start(); // 每次切换页面时，调用进度条
        const cancelKey = EnclosureHttp.genUniqueKey($config);
        $config.cancelToken = new this.CancelToken(
          (cancelExecutor: (cancel: any) => void) => {
            this.sourceTokenList.push({ cancelKey, cancelExecutor });
          }
        );
        this.cancelRepeatRequest();
        this.currentCancelTokenKey = cancelKey;
        // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback($config);
          return $config;
        }
        if (EnclosureHttp.initConfig.beforeRequestCallback) {
          EnclosureHttp.initConfig.beforeRequestCallback($config);
          return $config;
        }
        return $config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  /**
   * @description 清空当前cancelTokenList
   * @returns void 0
   */
  public clearCancelTokenList(): void {
    this.sourceTokenList.length = 0;
  }

  /**
   * @description 拦截响应
   * @returns void 0
   */
  private httpInterceptorsResponse(): void {
    const instance = EnclosureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: EnclosureHttpResoponse) => {
        const $config = response.config;
        // 请求每次成功一次就删除当前canceltoken标记
        const cancelKey = EnclosureHttp.genUniqueKey($config);
        this.deleteCancelTokenByCancelKey(cancelKey);

        NProgress.done();
        // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (EnclosureHttp.initConfig.beforeResponseCallback) {
          EnclosureHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }
        return response.data;
      },
      (error: EnclosureHttpError) => {
        const $error = error;
        // 判断当前的请求中是否在 取消token数组理存在，如果存在则移除（单次请求流程）
        if (this.currentCancelTokenKey) {
          const haskey = this.sourceTokenList.filter(
            cancelToken => cancelToken.cancelKey === this.currentCancelTokenKey
          ).length;
          if (haskey) {
            this.sourceTokenList = this.sourceTokenList.filter(
              cancelToken =>
                cancelToken.cancelKey !== this.currentCancelTokenKey
            );
            this.currentCancelTokenKey = "";
          }
        }
        $error.isCancelRequest = Axios.isCancel($error);
        NProgress.done();
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      }
    );
  }

  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: EnclosureHttpRequestConfig
  ): Promise<T> {
    const config = transformConfigByMethod(param, {
      method,
      url,
      ...axiosConfig
    } as EnclosureHttpRequestConfig);
    // 单独处理自定义请求/响应回掉
    return new Promise((resolve, reject) => {
      EnclosureHttp.axiosInstance
        .request(config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  public post<T>(
    url: string,
    params?: T,
    config?: EnclosureHttpRequestConfig
  ): Promise<T> {
    return this.request<T>("post", url, params, config);
  }

  public get<T>(
    url: string,
    params?: T,
    config?: EnclosureHttpRequestConfig
  ): Promise<T> {
    return this.request<T>("get", url, params, config);
  }
}

export default EnclosureHttp;
