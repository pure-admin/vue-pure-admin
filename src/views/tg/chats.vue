<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";
import { PureTableBar } from "@/components/RePureTableBar";
import {
  createChat,
  deleteChat,
  listAccounts,
  listChats,
  syncPeers,
  updateChat,
  type TelegramAccount,
  type TelegramChat
} from "@/api/tg";

defineOptions({
  name: "TGChatsView"
});

const accounts = ref<TelegramAccount[]>([]);
const selectedAccountID = ref<number>(0);

const loading = ref(false);
const dataList = ref<TelegramChat[]>([]);

const dialogVisible = ref(false);
const dialogTitle = ref("新增配置");
const submitting = ref(false);

const form = reactive<{
  id: number;
  account_id: number;
  role: "source" | "target";
  chat_id: number;
  enabled: boolean;
}>({
  id: 0,
  account_id: 0,
  role: "source",
  chat_id: 0,
  enabled: true
});

const accountOptions = computed(() =>
  accounts.value.map(a => ({
    label: `${a.id} - ${a.name || a.phone}`,
    value: a.id
  }))
);

const columns: TableColumnList = [
  { label: "ID", prop: "id", width: 80 },
  { label: "角色", prop: "role", width: 90, slot: "role" },
  { label: "Chat ID", prop: "chat_id", minWidth: 160 },
  { label: "类型", prop: "chat_type", width: 90 },
  { label: "启用", prop: "enabled", width: 90, slot: "enabled" },
  { label: "操作", fixed: "right", width: 220, slot: "operation" }
];

async function fetchAccounts() {
  const res = await listAccounts();
  accounts.value = res?.data?.items ?? [];
  if (!selectedAccountID.value && accounts.value.length > 0) {
    selectedAccountID.value = accounts.value[0].id;
  }
}

async function fetchChats() {
  if (!selectedAccountID.value) {
    dataList.value = [];
    return;
  }
  loading.value = true;
  try {
    const res = await listChats({ account_id: selectedAccountID.value });
    dataList.value = res?.data?.items ?? [];
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  if (!selectedAccountID.value) {
    message("请先创建账号", { type: "warning" });
    return;
  }
  dialogTitle.value = "新增群配置";
  form.id = 0;
  form.account_id = selectedAccountID.value;
  form.role = "source";
  form.chat_id = 0;
  form.enabled = true;
  dialogVisible.value = true;
}

function openEdit(row: TelegramChat) {
  dialogTitle.value = "编辑群配置";
  form.id = row.id;
  form.account_id = row.account_id;
  form.role = row.role;
  form.chat_id = row.chat_id;
  form.enabled = row.enabled;
  dialogVisible.value = true;
}

async function submit() {
  if (!form.account_id || !form.chat_id) {
    message("请填写 account_id / chat_id", { type: "warning" });
    return;
  }
  submitting.value = true;
  try {
    if (form.id === 0) {
      await createChat({
        account_id: form.account_id,
        role: form.role,
        chat_id: form.chat_id,
        enabled: form.enabled
      });
      message("创建成功", { type: "success" });
    } else {
      await updateChat(form.id, {
        account_id: form.account_id,
        role: form.role,
        chat_id: form.chat_id,
        enabled: form.enabled
      });
      message("更新成功", { type: "success" });
    }
    dialogVisible.value = false;
    await fetchChats();
  } finally {
    submitting.value = false;
  }
}

async function onDelete(row: TelegramChat) {
  await ElMessageBox.confirm(`确认删除配置 #${row.id} 吗？`, "提示", {
    type: "warning",
    confirmButtonText: "删除",
    cancelButtonText: "取消"
  });
  await deleteChat(row.id);
  message("删除成功", { type: "success" });
  await fetchChats();
}

async function onSyncPeers() {
  if (!selectedAccountID.value) return;
  await syncPeers({ account_id: selectedAccountID.value });
  message("同步 peers 成功", { type: "success" });
}

watch(selectedAccountID, fetchChats);

onMounted(async () => {
  await fetchAccounts();
  await fetchChats();
});
</script>

<template>
  <el-card shadow="never">
    <div class="flex items-center justify-between mb-4 flex-wrap">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-sm">选择账号：</span>
        <el-select
          v-model="selectedAccountID"
          placeholder="请选择账号"
          class="w-[320px]!"
          filterable
        >
          <el-option
            v-for="opt in accountOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <el-button type="primary" @click="openCreate">新增配置</el-button>
        <el-button @click="onSyncPeers">同步 peers</el-button>
      </div>
      <el-alert
        type="info"
        :closable="false"
        title="添加 chat_id 前请确保该账号已登录并能在 dialogs 里看到该群/频道（否则无法获取 channel access_hash）。"
        class="max-w-[820px]"
      />
    </div>

    <PureTableBar
      title="群配置（source/target）"
      :columns="columns"
      @refresh="fetchChats"
    >
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
          <template #role="{ row }">
            <el-tag
              size="small"
              :type="row.role === 'target' ? 'success' : 'info'"
              effect="plain"
            >
              {{ row.role }}
            </el-tag>
          </template>
          <template #enabled="{ row }">
            <el-tag
              size="small"
              :type="row.enabled ? 'success' : 'info'"
              effect="plain"
            >
              {{ row.enabled ? "启用" : "禁用" }}
            </el-tag>
          </template>
          <template #operation="{ row }">
            <el-button link type="primary" :size="size" @click="openEdit(row)">
              编辑
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
      <el-form-item label="账号">
        <el-select
          v-model="form.account_id"
          placeholder="请选择账号"
          class="w-full"
          filterable
        >
          <el-option
            v-for="opt in accountOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="角色">
        <el-radio-group v-model="form.role">
          <el-radio label="source">source</el-radio>
          <el-radio label="target">target</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="chat_id">
        <el-input-number v-model="form.chat_id" :min="1" class="w-full" />
      </el-form-item>
      <el-form-item label="启用">
        <el-switch v-model="form.enabled" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">
        保存
      </el-button>
    </template>
  </el-dialog>
</template>
