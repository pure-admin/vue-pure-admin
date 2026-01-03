import { http } from "@/utils/http";

export interface CertInfo {
  id?: string;
  cert_no: string;
  image_uri: string;
  created_at?: string;
}

/** 获取证书列表 */
export const getCertList = () =>
  http.request<CertInfo[]>("get", "/cert/infos/");

/** 创建证书 (支持文件上传) */
export const createCert = (data: FormData) =>
  http.request<CertInfo>("post", "/cert/infos/", {
    data,
    headers: { "Content-Type": "multipart/form-data" }
  });

/** 删除证书 */
export const deleteCert = (id: string) =>
  http.request<any>("delete", `/cert/infos/${id}/`);
