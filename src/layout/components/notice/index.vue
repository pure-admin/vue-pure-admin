<script setup lang="ts">
import { ref } from "vue";
import NoticeList from "./noticeList.vue";
import { noticesData } from "./data";

const activeName = ref(noticesData[0].name);
const notices = ref(noticesData);

let noticesNum = ref(0);
notices.value.forEach(notice => {
  noticesNum.value += notice.list.length;
});
</script>

<template>
  <el-dropdown trigger="click" placement="bottom-end">
    <span class="dropdown-badge">
      <el-badge :value="noticesNum" :max="99">
        <el-icon class="header-notice-icon"
          ><IconifyIconOffline icon="bell"
        /></el-icon>
      </el-badge>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-tabs v-model="activeName" class="dropdown-tabs">
          <template v-for="item in notices" :key="item.key">
            <el-tab-pane
              :label="`${item.name}(${item.list.length})`"
              :name="item.name"
            >
              <el-scrollbar max-height="330px">
                <div class="noticeList-container">
                  <NoticeList :list="item.list" />
                </div>
              </el-scrollbar>
            </el-tab-pane>
          </template>
        </el-tabs>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 60px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}

.dropdown-tabs {
  width: 336px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
  border-radius: 4px;

  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-scroll) {
    display: flex;
    justify-content: center;
  }

  :deep(.el-tabs__nav-wrap)::after {
    height: 1px;
  }

  :deep(.noticeList-container) {
    padding: 15px 24px 0 24px;
  }
}
</style>
