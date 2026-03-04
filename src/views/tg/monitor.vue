<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { message } from "@/utils/message";
import { PureTableBar } from "@/components/RePureTableBar";
import { dispatchMessage, listMessages, type ClonedMessage } from "@/api/tg";

defineOptions({
  name: "TGMonitorView"
});

const loading = ref(false);
const dispatching = ref<Record<number, boolean>>({});

const cursor = ref(0);
const dataList = ref<ClonedMessage[]>([]);

const columns: TableColumnList = [
  { label: "ID", prop: "id", width: 80 },
  { label: "动作", prop: "action", width: 90, slot: "action" },
  { label: "文本", prop: "text", minWidth: 360 },
  { label: "媒体", prop: "media_type", width: 90, slot: "media" },
  { label: "状态", prop: "dispatched", width: 110, slot: "status" },
  { label: "错误", prop: "dispatch_error", minWidth: 200 },
  { label: "操作", fixed: "right", width: 160, slot: "operation" }
];

let timer: number | undefined;

async function pollOnce() {
  if (loading.value) return;
  loading.value = true;
  try {
    const res = await listMessages({ after: cursor.value, limit: 50 });
    const items = res?.data?.items ?? [];
    const max = res?.data?.max_sort_index ?? cursor.value;

    if (items.length > 0) {
      dataList.value = dataList.value.concat(items);
      if (dataList.value.length > 500) {
        dataList.value = dataList.value.slice(-500);
      }
    }
    cursor.value = Math.max(cursor.value, max);
  } finally {
    loading.value = false;
  }
}

function startPolling() {
  stopPolling();
  timer = window.setInterval(pollOnce, 2000);
}

function stopPolling() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
}

async function onDispatch(row: ClonedMessage) {
  if (row.dispatched) return;
  dispatching.value[row.id] = true;
  try {
    await dispatchMessage(row.id);
    row.dispatched = true;
    row.dispatch_error = undefined;
    message("已克隆到目标群", { type: "success" });
  } catch (err: any) {
    message(err?.message ?? "克隆失败", { type: "error" });
  } finally {
    dispatching.value[row.id] = false;
  }
}

onMounted(async () => {
  await pollOnce();
  startPolling();
});

onUnmounted(stopPolling);
</script>

<template>
  <el-card shadow="never">
    <PureTableBar title="克隆监控" :columns="columns" @refresh="pollOnce">
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
              :type="row.action === 'clone' ? 'success' : 'warning'"
              effect="plain"
            >
              {{ row.action }}
            </el-tag>
          </template>
          <template #media="{ row }">
            <el-tag
              size="small"
              :type="row.has_media ? 'info' : null"
              effect="plain"
            >
              {{ row.has_media ? row.media_type : "none" }}
            </el-tag>
          </template>
          <template #status="{ row }">
            <el-tag
              size="small"
              :type="row.dispatched ? 'success' : 'info'"
              effect="plain"
            >
              {{ row.dispatched ? "已分发" : "待分发" }}
            </el-tag>
          </template>
          <template #operation="{ row }">
            <el-button
              link
              type="primary"
              :size="size"
              :disabled="row.dispatched"
              :loading="dispatching[row.id]"
              @click="onDispatch(row)"
            >
              一键克隆
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </el-card>
</template>
