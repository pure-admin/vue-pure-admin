<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";
import { PureTableBar } from "@/components/RePureTableBar";
import {
  createRule,
  deleteRule,
  listRules,
  updateRule,
  type KeywordRule
} from "@/api/tg";

defineOptions({
  name: "TGRulesView"
});

const loading = ref(false);
const dataList = ref<KeywordRule[]>([]);

const dialogVisible = ref(false);
const dialogTitle = ref("新增规则");
const submitting = ref(false);

const form = reactive<{
  id: number;
  keyword: string;
  action: KeywordRule["action"];
  enabled: boolean;
  priority: number;
}>({
  id: 0,
  keyword: "",
  action: "clone",
  enabled: true,
  priority: 0
});

const columns: TableColumnList = [
  { label: "ID", prop: "id", width: 80 },
  { label: "关键词", prop: "keyword", minWidth: 220 },
  { label: "动作", prop: "action", width: 110, slot: "action" },
  { label: "启用", prop: "enabled", width: 90, slot: "enabled" },
  { label: "优先级", prop: "priority", width: 90 },
  { label: "操作", fixed: "right", width: 180, slot: "operation" }
];

async function fetchRules() {
  loading.value = true;
  try {
    const res = await listRules();
    dataList.value = res?.data?.items ?? [];
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  dialogTitle.value = "新增规则";
  form.id = 0;
  form.keyword = "";
  form.action = "clone";
  form.enabled = true;
  form.priority = 0;
  dialogVisible.value = true;
}

function openEdit(row: KeywordRule) {
  dialogTitle.value = "编辑规则";
  form.id = row.id;
  form.keyword = row.keyword;
  form.action = row.action;
  form.enabled = row.enabled;
  form.priority = row.priority;
  dialogVisible.value = true;
}

async function submit() {
  if (!form.keyword.trim()) {
    message("关键词不能为空", { type: "warning" });
    return;
  }

  submitting.value = true;
  try {
    if (form.id === 0) {
      await createRule({
        keyword: form.keyword,
        action: form.action,
        enabled: form.enabled,
        priority: form.priority
      });
      message("创建成功", { type: "success" });
    } else {
      await updateRule(form.id, {
        keyword: form.keyword,
        action: form.action,
        enabled: form.enabled,
        priority: form.priority
      });
      message("更新成功", { type: "success" });
    }
    dialogVisible.value = false;
    await fetchRules();
  } finally {
    submitting.value = false;
  }
}

async function onDelete(row: KeywordRule) {
  await ElMessageBox.confirm(`确认删除规则 #${row.id} 吗？`, "提示", {
    type: "warning",
    confirmButtonText: "删除",
    cancelButtonText: "取消"
  });
  await deleteRule(row.id);
  message("删除成功", { type: "success" });
  await fetchRules();
}

onMounted(fetchRules);
</script>

<template>
  <el-card shadow="never">
    <PureTableBar title="关键词管理" :columns="columns" @refresh="fetchRules">
      <template #buttons>
        <el-button type="primary" @click="openCreate">新增规则</el-button>
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
          <template #action="{ row }">
            <el-tag
              size="small"
              :type="
                row.action === 'ignore'
                  ? 'danger'
                  : row.action === 'clone'
                    ? 'success'
                    : 'warning'
              "
              effect="plain"
            >
              {{ row.action }}
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

  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="520px">
    <el-form label-width="110px">
      <el-form-item label="关键词">
        <el-input v-model="form.keyword" placeholder="如：优惠 / 返现 / 代发" />
      </el-form-item>
      <el-form-item label="动作">
        <el-select v-model="form.action" placeholder="请选择">
          <el-option label="ignore（丢弃）" value="ignore" />
          <el-option label="clone（克隆）" value="clone" />
          <el-option label="audit（审计）" value="audit" />
        </el-select>
      </el-form-item>
      <el-form-item label="启用">
        <el-switch v-model="form.enabled" />
      </el-form-item>
      <el-form-item label="优先级">
        <el-input-number v-model="form.priority" :min="-9999" :max="9999" />
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
