import { http } from "@/utils/http";

export type AdminUserItem = {
  id: string;
  email?: string | null;
  phone?: string | null;
  nickname: string;
  role: string;
  roles?: Array<string>;
  status: string;
  planCode: string;
  planName: string;
  creditBalance: number;
  sessionCount: number;
  lastLoginAt?: string | null;
  createdAt: string;
};

export type AdminUserListResponse = {
  list: Array<AdminUserItem>;
  total: number;
  page: number;
  pageSize: number;
};

export type AdminPermissionCatalogItem = {
  code: string;
  label: string;
  kind: string;
  route?: string | null;
  description?: string | null;
};

export type AdminRolePolicyItem = {
  code: string;
  name: string;
  description?: string | null;
  permissions: Array<string>;
  routes: Array<string>;
  canAssignRoles: Array<string>;
};

export type AdminRbacPolicyResponse = {
  roles: Array<AdminRolePolicyItem>;
  permissionCatalog: Array<AdminPermissionCatalogItem>;
  updatedAt: string;
};

export type AdminRbacPolicyUpdatePayload = {
  roles: Array<
    Pick<AdminRolePolicyItem, "code" | "name" | "description" | "permissions">
  >;
  permissionCatalog?: Array<
    Pick<
      AdminPermissionCatalogItem,
      "code" | "label" | "kind" | "route" | "description"
    >
  >;
};

export type AdminSessionMessage = {
  id: number;
  role: string;
  text: string;
  imagePreview?: string | null;
  chips?: Array<string>;
  tips?: Array<string>;
  structured?: {
    productName?: string;
    summary?: string;
    warnings?: Array<string>;
  } | null;
};

export type AdminSessionSummary = {
  id: string;
  title: string;
  preview: string;
  userId?: string | null;
  userNickname: string;
  messageCount: number;
  hasImage: boolean;
  updatedAt: string;
};

export type AdminSessionListResponse = {
  list: Array<AdminSessionSummary>;
  total: number;
  page: number;
  pageSize: number;
};

export type AdminSessionDetailResponse = {
  session: AdminSessionSummary;
  messages: Array<AdminSessionMessage>;
};

export type AdminRecognitionSummary = {
  id: string;
  sessionId: string;
  userId?: string | null;
  userNickname: string;
  userMessageId: number;
  assistantMessageId?: number | null;
  question: string;
  imagePreview?: string | null;
  productName?: string | null;
  summary?: string | null;
  riskLevel?: string | null;
  warnings: Array<string>;
  confidence?: number | null;
  status: string;
  actuallyUsedModel?: string | null;
  route?: string | null;
  updatedAt: string;
};

export type AdminRecognitionListResponse = {
  list: Array<AdminRecognitionSummary>;
  total: number;
  page: number;
  pageSize: number;
};

export type AdminRecognitionDetailResponse = {
  record: AdminRecognitionSummary;
  userMessage: AdminSessionMessage;
  assistantMessage?: AdminSessionMessage | null;
};

export type AdminAuditLogItem = {
  id: string;
  adminUserId?: string | null;
  adminNickname: string;
  adminRole?: string | null;
  action: string;
  targetType: string;
  targetId: string;
  targetLabel?: string | null;
  summary: string;
  detail: Record<string, unknown>;
  createdAt: string;
};

export type AdminAuditLogListResponse = {
  list: Array<AdminAuditLogItem>;
  total: number;
  page: number;
  pageSize: number;
};

export type AdminAuditLogDetailResponse = {
  record: AdminAuditLogItem;
};

export type AdminDashboardDistributionItem = {
  key: string;
  label: string;
  value: number;
};

export type AdminDashboardTrendPoint = {
  date: string;
  newUsers: number;
  newSessions: number;
  newMessages: number;
};

export type AdminDashboardChartsResponse = {
  dailyTrend: Array<AdminDashboardTrendPoint>;
  planDistribution: Array<AdminDashboardDistributionItem>;
  recognitionStatusDistribution: Array<AdminDashboardDistributionItem>;
  riskLevelDistribution: Array<AdminDashboardDistributionItem>;
};

export type AdminDashboardSummary = {
  userCount: number;
  activeUserCount: number;
  disabledUserCount: number;
  sessionCount: number;
  messageCount: number;
  imageSessionCount: number;
  todayNewUsers: number;
  todayMessages: number;
};

export const getAdminUsers = (params?: {
  keyword?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) => {
  return http.request<AdminUserListResponse>("get", "/api/admin/users", {
    params
  });
};

export const getAdminUserDetail = (userId: string) => {
  return http.request<AdminUserItem>("get", `/api/admin/users/${userId}`);
};

export const updateAdminUserStatus = (userId: string, status: string) => {
  return http.request<AdminUserItem>(
    "post",
    `/api/admin/users/${userId}/status`,
    {
      data: { status }
    }
  );
};

export const updateAdminUserRole = (userId: string, role: string) => {
  return http.request<AdminUserItem>(
    "post",
    `/api/admin/users/${userId}/role`,
    {
      data: { role }
    }
  );
};

export const updateAdminUserRoles = (userId: string, roles: Array<string>) => {
  return http.request<AdminUserItem>(
    "post",
    `/api/admin/users/${userId}/roles`,
    {
      data: { roles }
    }
  );
};

export const updateAdminUserPlan = (userId: string, planCode: string) => {
  return http.request<AdminUserItem>(
    "post",
    `/api/admin/users/${userId}/plan`,
    {
      data: { planCode }
    }
  );
};

export const adjustAdminUserCredits = (
  userId: string,
  delta: number,
  reason?: string
) => {
  return http.request<AdminUserItem>(
    "post",
    `/api/admin/users/${userId}/credits`,
    {
      data: { delta, reason }
    }
  );
};

export const getAdminChatSessions = (params?: {
  keyword?: string;
  userId?: string;
  page?: number;
  pageSize?: number;
}) => {
  return http.request<AdminSessionListResponse>(
    "get",
    "/api/admin/chat/sessions",
    {
      params
    }
  );
};

export const getAdminChatSessionDetail = (sessionId: string) => {
  return http.request<AdminSessionDetailResponse>(
    "get",
    `/api/admin/chat/sessions/${sessionId}`
  );
};

export const getAdminChatRecognitions = (params?: {
  keyword?: string;
  status?: string;
  riskLevel?: string;
  page?: number;
  pageSize?: number;
}) => {
  return http.request<AdminRecognitionListResponse>(
    "get",
    "/api/admin/chat/recognitions",
    { params }
  );
};

export const getAdminChatRecognitionDetail = (
  sessionId: string,
  messageId: number
) => {
  return http.request<AdminRecognitionDetailResponse>(
    "get",
    `/api/admin/chat/recognitions/${sessionId}/${messageId}`
  );
};

export const getAdminAuditLogs = (params?: {
  keyword?: string;
  action?: string;
  page?: number;
  pageSize?: number;
}) => {
  return http.request<AdminAuditLogListResponse>(
    "get",
    "/api/admin/audit/logs",
    {
      params
    }
  );
};

export const getAdminRbacPolicy = () => {
  return http.request<AdminRbacPolicyResponse>("get", "/api/admin/rbac/policy");
};

export const updateAdminRbacPolicy = (
  payload: AdminRbacPolicyUpdatePayload
) => {
  return http.request<AdminRbacPolicyResponse>(
    "put",
    "/api/admin/rbac/policy",
    {
      data: payload
    }
  );
};

export const getAdminAuditLogDetail = (logId: string) => {
  return http.request<AdminAuditLogDetailResponse>(
    "get",
    `/api/admin/audit/logs/${logId}`
  );
};

export const getAdminDashboardSummary = () => {
  return http.request<AdminDashboardSummary>(
    "get",
    "/api/admin/dashboard/summary"
  );
};

export const getAdminDashboardCharts = () => {
  return http.request<AdminDashboardChartsResponse>(
    "get",
    "/api/admin/dashboard/charts"
  );
};