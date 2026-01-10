<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessageBox } from "element-plus"; // 引入弹窗组件
import NoticeList from "./components/NoticeList.vue";
import BellIcon from "~icons/ep/bell";
import { http } from "@/utils/http";

const { t } = useI18n();
const noticesNum = ref(0);
const dialogVisible = ref(false);
const rawNotifications = ref([]);

// 1. 获取通知列表
async function getNotices() {
  try {
    const res = await http.get<any, any>("/notification/info/");
    rawNotifications.value = Array.isArray(res) ? res : res.data || [];
    await getUnreadCount();
  } catch (error) {
    console.error("获取通知失败:", error);
  }
}

// 2. 获取未读数
async function getUnreadCount() {
  const res = await http.get<any, any>("/notification/info/unread-count/");
  const data = res.unread_count !== undefined ? res : res.data;
  noticesNum.value = data?.unread_count || 0;
}

// 3. 按 actor_name 分组计算属性
const groupedNotices = computed(() => {
  const groups: Record<string, any[]> = {};
  rawNotifications.value.forEach(item => {
    const sender = item.actor_name || "系统通知";
    if (!groups[sender]) groups[sender] = [];
    groups[sender].push({
      ...item,
      title: item.verb,
      datetime: item.timestamp.split("T")[0],
      extra: item.unread ? "未读" : "已读",
      status: item.unread ? "danger" : "info"
    });
  });
  return groups;
});

// 4. 点击单条消息：展示详情并标记已读
function handleItemClick(item) {
  // 弹出详情小窗
  ElMessageBox.alert(
    item.description || item.verb,
    `来自 ${item.actor_name} 的消息`,
    {
      confirmButtonText: "确定",
      callback: async () => {
        // 如果是未读，点击确定后标记已读
        if (item.unread) {
          await http.post<any, any>(
            `/notification/info/${item.id}/mark-as-read/`
          );
          getNotices(); // 刷新列表和未读数
        }
      }
    }
  );
  // 如果你想点击瞬间就标记已读而不等点确认，可以把上面的 if 逻辑移到 Alert 外部
}

// 全部标记已读
async function markAllAsRead() {
  await http.post<any, any>("/notification/info/mark-all-as-read/");
  getNotices();
}

onMounted(() => {
  getNotices();
});
</script>

<template>
  <div class="message-center">
    <span
      class="dropdown-badge navbar-bg-hover select-none"
      @click="dialogVisible = true"
    >
      <el-badge :value="noticesNum === 0 ? '' : noticesNum" :max="99">
        <span class="header-notice-icon">
          <component :is="BellIcon" />
        </span>
      </el-badge>
    </span>

    <el-dialog
      v-model="dialogVisible"
      title="消息中心"
      width="60%"
      class="fixed-height-dialog"
      destroy-on-close
      center
    >
      <template #header>
        <div class="flex justify-between items-center pr-8">
          <span class="text-lg font-bold">消息中心</span>
          <el-button
            v-if="noticesNum > 0"
            type="primary"
            link
            @click="markAllAsRead"
          >
            全部标记已读
          </el-button>
        </div>
      </template>

      <div class="scroll-container">
        <el-empty v-if="rawNotifications.length === 0" description="暂无消息" />
        <el-collapse v-else>
          <el-collapse-item
            v-for="(list, sender) in groupedNotices"
            :key="sender"
            :name="sender"
          >
            <template #title>
              <div class="flex items-center w-full px-2">
                <span class="font-bold text-blue-500">{{ sender }}</span>
                <el-tag size="small" class="ml-2" type="info"
                  >{{ list.length }} 条记录</el-tag
                >
                <el-badge
                  is-dot
                  :hidden="!list.some(i => i.unread)"
                  class="ml-2"
                />
              </div>
            </template>
            <NoticeList :list="list" @item-click="handleItemClick" />
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}

/* 核心：固定高度样式 */
.scroll-container {
  height: 500px; /* 设置你想要的固定高度 */
  padding-right: 10px;
  overflow-y: auto;
}

/* 优化折叠面板样式 */
:deep(.el-collapse-item__content) {
  padding-bottom: 10px;
}

:deep(.el-dialog__body) {
  padding-top: 10px;
}
</style>
