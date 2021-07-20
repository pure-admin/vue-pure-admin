import Axios, {
  AxiosRequestConfig,
  Canceler,
  AxiosResponse,
  Method,
  AxiosError
} from "axios";

import { METHODS } from "./config";

export type cancelTokenType = { cancelKey: string; cancelExecutor: Canceler };

export type RequestMethods = Extract<
  Method,
  "get" | "post" | "put" | "delete" | "patch" | "option" | "head"
>;

export interface EnclosureHttpRequestConfig extends AxiosRequestConfig {
  beforeRequestCallback?: (request: EnclosureHttpRequestConfig) => void; // 请求发送之前
  beforeResponseCallback?: (response: EnclosureHttpResoponse) => void; // 相应返回之前
}

export interface EnclosureHttpResoponse extends AxiosResponse {
  config: EnclosureHttpRequestConfig;
}

export interface EnclosureHttpError extends AxiosError {
  isCancelRequest?: boolean;
}

export default class EnclosureHttp {
  cancelTokenList: Array<cancelTokenType>;
  clearCancelTokenList(): void;
  request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: EnclosureHttpRequestConfig
  ): Promise<T>;
  post<T>(
    url: string,
    params?: T,
    config?: EnclosureHttpRequestConfig
  ): Promise<T>;
  get<T>(
    url: string,
    params?: T,
    config?: EnclosureHttpRequestConfig
  ): Promise<T>;
}
