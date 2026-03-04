import { http } from "@/utils/http";

export type ApiResp<T> = {
  code: number;
  message: string;
  data?: T;
};

export type KeywordRule = {
  id: number;
  keyword: string;
  action: "ignore" | "clone" | "audit";
  enabled: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
};

export type ClonedMessage = {
  id: number;
  account_id: number;
  source_chat_id: number;
  source_chat_type: "chat" | "channel";
  source_message_id: number;
  sender_id?: number;
  text: string;
  has_media: boolean;
  media_type: string;
  matched_rule_id?: number;
  action: "clone" | "audit";
  sort_index: number;
  dispatched: boolean;
  dispatch_error?: string;
  dispatched_at?: string;
  created_at: string;
  updated_at: string;
};

export type TelegramAccount = {
  id: number;
  name: string;
  phone: string;
  api_id: number;
  api_hash: string;
  created_at: string;
  updated_at: string;
};

export type TelegramChat = {
  id: number;
  account_id: number;
  role: "source" | "target";
  chat_id: number;
  chat_type: "chat" | "channel";
  access_hash?: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

export const listRules = () =>
  http.request<ApiResp<{ items: KeywordRule[] }>>("get", "/api/rules");

export const createRule = (data: {
  keyword: string;
  action: KeywordRule["action"];
  enabled?: boolean;
  priority?: number;
}) => http.request<ApiResp<KeywordRule>>("post", "/api/rules", { data });

export const updateRule = (
  id: number,
  data: {
    keyword: string;
    action: KeywordRule["action"];
    enabled: boolean;
    priority: number;
  }
) => http.request<ApiResp<KeywordRule>>("put", `/api/rules/${id}`, { data });

export const deleteRule = (id: number) =>
  http.request<ApiResp<Record<string, never>>>("delete", `/api/rules/${id}`);

export const listMessages = (params: { after: number; limit?: number }) =>
  http.request<ApiResp<{ items: ClonedMessage[]; max_sort_index: number }>>(
    "get",
    "/api/messages",
    { params }
  );

export const dispatchMessage = (id: number) =>
  http.request<ApiResp<Record<string, never>>>(
    "post",
    `/api/messages/${id}/dispatch`
  );

export const listAccounts = () =>
  http.request<ApiResp<{ items: TelegramAccount[] }>>(
    "get",
    "/api/tg/accounts"
  );

export const createAccount = (data: {
  name?: string;
  phone: string;
  api_id: number;
  api_hash: string;
}) =>
  http.request<ApiResp<TelegramAccount>>("post", "/api/tg/accounts", { data });

export const updateAccount = (
  id: number,
  data: { name?: string; phone: string; api_id: number; api_hash: string }
) =>
  http.request<ApiResp<TelegramAccount>>("put", `/api/tg/accounts/${id}`, {
    data
  });

export const deleteAccount = (id: number) =>
  http.request<ApiResp<Record<string, never>>>(
    "delete",
    `/api/tg/accounts/${id}`
  );

export const loginStart = (data: { account_id: number }) =>
  http.request<ApiResp<{ login_attempt_id: number }>>(
    "post",
    "/api/tg/login/start",
    { data }
  );

export const loginVerify = (data: {
  login_attempt_id: number;
  code: string;
  password?: string;
}) =>
  http.request<ApiResp<Record<string, never>>>("post", "/api/tg/login/verify", {
    data
  });

export const syncPeers = (data: { account_id: number }) =>
  http.request<ApiResp<Record<string, never>>>("post", "/api/tg/peers/sync", {
    data
  });

export const startScraper = (data: { account_id: number }) =>
  http.request<ApiResp<Record<string, never>>>(
    "post",
    "/api/tg/scraper/start",
    {
      data
    }
  );

export const stopScraper = (data: { account_id: number }) =>
  http.request<ApiResp<Record<string, never>>>("post", "/api/tg/scraper/stop", {
    data
  });

export const listChats = (params: { account_id: number }) =>
  http.request<ApiResp<{ items: TelegramChat[] }>>("get", "/api/tg/chats", {
    params
  });

export const createChat = (data: {
  account_id: number;
  role: "source" | "target";
  chat_id: number;
  enabled?: boolean;
}) => http.request<ApiResp<TelegramChat>>("post", "/api/tg/chats", { data });

export const updateChat = (
  id: number,
  data: {
    account_id: number;
    role: "source" | "target";
    chat_id: number;
    enabled: boolean;
  }
) =>
  http.request<ApiResp<TelegramChat>>("put", `/api/tg/chats/${id}`, { data });

export const deleteChat = (id: number) =>
  http.request<ApiResp<Record<string, never>>>("delete", `/api/tg/chats/${id}`);
