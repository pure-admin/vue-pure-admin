<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";
import { PureTableBar } from "@/components/RePureTableBar";
import {
  createAccount,
  deleteAccount,
  listAccounts,
  loginStart,
  loginVerify,
  startScraper,
  stopScraper,
  syncPeers,
  updateAccount,
  type TelegramAccount
} from "@/api/tg";

defineOptions({
  name: "TGAccountsView"
});

const loading = ref(false);
const dataList = ref<TelegramAccount[]>([]);

const dialogVisible = ref(false);
const dialogTitle = ref("新增账号");
const submitting = ref(false);

const form = reactive<{
  id: number;
  name: string;
  phone: string;
  api_id: number;
  api_hash: string;
}>({
  id: 0,
  name: "",
  phone: "",
  api_id: 0,
  api_hash: ""
});

const loginVisible = ref(false);
const loginSubmitting = ref(false);
const loginForm = reactive<{
  account_id: number;
  login_attempt_id: number;
  code: string;
  password: string;
}>({
  account_id: 0,
  login_attempt_id: 0,
  code: "",
  password: ""
});

const columns: TableColumnList = [
  { label: "ID", prop: "id", width: 80 },
  { label: "名称", prop: "name", minWidth: 160 },
  { label: "手机号", prop: "phone", minWidth: 160 },
  { label: "API ID", prop: "api_id", width: 100 },
  { label: "操作", fixed: "right", width: 420, slot: "operation" }
];

async function fetchAccounts() {
  loading.value = true;
  try {
    const res = await listAccounts();
    dataList.value = res?.data?.items ?? [];
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  dialogTitle.value = "新增账号";
  form.id = 0;
  form.name = "";
  form.phone = "";
  form.api_id = 0;
  form.api_hash = "";
  dialogVisible.value = true;
}

function openEdit(row: TelegramAccount) {
  dialogTitle.value = "编辑账号";
  form.id = row.id;
  form.name = row.name ?? "";
  form.phone = row.phone;
  form.api_id = row.api_id;
  form.api_hash = row.api_hash;
  dialogVisible.value = true;
}

async function submit() {
  if (!form.phone.trim() || !form.api_hash.trim() || !form.api_id) {
    message("请填写 phone / api_id / api_hash", { type: "warning" });
    return;
  }
  submitting.value = true;
  try {
    if (form.id === 0) {
      await createAccount({
        name: form.name,
        phone: form.phone,
        api_id: form.api_id,
        api_hash: form.api_hash
      });
      message("创建成功", { type: "success" });
    } else {
      await updateAccount(form.id, {
        name: form.name,
        phone: form.phone,
        api_id: form.api_id,
        api_hash: form.api_hash
      });
      message("更新成功", { type: "success" });
    }
    dialogVisible.value = false;
    await fetchAccounts();
  } finally {
    submitting.value = false;
  }
}

async function onDelete(row: TelegramAccount) {
  await ElMessageBox.confirm(`确认删除账号 #${row.id} 吗？`, "提示", {
    type: "warning",
    confirmButtonText: "删除",
    cancelButtonText: "取消"
  });
  await deleteAccount(row.id);
  message("删除成功", { type: "success" });
  await fetchAccounts();
}

async function onLogin(row: TelegramAccount) {
  loginSubmitting.value = true;
  try {
    const res = await loginStart({ account_id: row.id });
    const attemptId = res?.data?.login_attempt_id ?? 0;
    if (!attemptId) {
      message("发送验证码失败：未返回 login_attempt_id", { type: "error" });
      return;
    }
    loginForm.account_id = row.id;
    loginForm.login_attempt_id = attemptId;
    loginForm.code = "";
    loginForm.password = "";
    loginVisible.value = true;
    message("验证码已发送，请填写 code 完成登录", { type: "success" });
  } finally {
    loginSubmitting.value = false;
  }
}

async function onVerify() {
  if (!loginForm.login_attempt_id || !loginForm.code.trim()) {
    message("请填写验证码", { type: "warning" });
    return;
  }
  loginSubmitting.value = true;
  try {
    await loginVerify({
      login_attempt_id: loginForm.login_attempt_id,
      code: loginForm.code,
      password: loginForm.password || undefined
    });
    loginVisible.value = false;
    message("登录成功（已尝试同步 peers）", { type: "success" });
  } finally {
    loginSubmitting.value = false;
  }
}

async function onSyncPeers(row: TelegramAccount) {
  await syncPeers({ account_id: row.id });
  message("同步 peers 成功", { type: "success" });
}

async function onStartScraper(row: TelegramAccount) {
  await startScraper({ account_id: row.id });
  message("监听已启动", { type: "success" });
}

async function onStopScraper(row: TelegramAccount) {
  await stopScraper({ account_id: row.id });
  message("监听已停止", { type: "success" });
}

onMounted(fetchAccounts);
</script>

<template>
  <el-card shadow="never">
    <PureTableBar title="账号管理" :columns="columns" @refresh="fetchAccounts">
      <template #buttons>
        <el-button type="primary" @click="openCreate">新增账号</el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          row-key="id"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <el-button link type="primary" :size="size" @click="openEdit(row)">
              编辑
            </el-button>
            <el-button link type="primary" :size="size" @click="onLogin(row)">
              登录
            </el-button>
            <el-button
              link
              type="primary"
              :size="size"
              @click="onSyncPeers(row)"
            >
              同步 peers
            </el-button>
            <el-button
              link
              type="success"
              :size="size"
              @click="onStartScraper(row)"
            >
              启动监听
            </el-button>
            <el-button
              link
              type="warning"
              :size="size"
              @click="onStopScraper(row)"
            >
              停止监听
            </el-button>
            <el-button link type="danger" :size="size" @click="onDelete(row)">
              删除
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </el-card>

  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px">
    <el-form label-width="110px">
      <el-form-item label="名称">
        <el-input v-model="form.name" placeholder="可选" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.phone" placeholder="+86xxxxxx" />
      </el-form-item>
      <el-form-item label="API ID">
        <el-input-number v-model="form.api_id" :min="1" />
      </el-form-item>
      <el-form-item label="API Hash">
        <el-input
          v-model="form.api_hash"
          placeholder="从 my.telegram.org 获取"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">
        保存
      </el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="loginVisible" title="账号登录" width="560px">
    <el-alert
      type="info"
      :closable="false"
      title="请先确保该账号已能接收验证码；如开启 2FA 请输入 password。登录成功后建议再点一次“同步 peers”。"
      class="mb-3"
    />
    <el-form label-width="140px">
      <el-form-item label="login_attempt_id">
        <el-input v-model="loginForm.login_attempt_id" disabled />
      </el-form-item>
      <el-form-item label="验证码（code）">
        <el-input
          v-model="loginForm.code"
          placeholder="短信/Telegram 内验证码"
        />
      </el-form-item>
      <el-form-item label="2FA 密码（可选）">
        <el-input
          v-model="loginForm.password"
          placeholder="如未开启 2FA 可留空"
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="loginVisible = false">取消</el-button>
      <el-button type="primary" :loading="loginSubmitting" @click="onVerify">
        验证登录
      </el-button>
    </template>
  </el-dialog>
</template>
