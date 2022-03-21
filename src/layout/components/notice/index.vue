<script setup lang="ts">
import { ref } from "vue";
import { noticesData } from "./data";
import NoticeList from "./noticeList.vue";
import { templateRef } from "@vueuse/core";
import { Tabs, TabPane } from "@pureadmin/components";

const dropdownDom = templateRef<ElRef | null>("dropdownDom", null);
const activeName = ref(noticesData[0].name);
const notices = ref(noticesData);

let noticesNum = ref(0);
notices.value.forEach(notice => {
  noticesNum.value += notice.list.length;
});

function tabClick() {
  // @ts-expect-error
  dropdownDom.value.handleOpen();
}
</script>

<template>
  <el-dropdown ref="dropdownDom" trigger="click" placement="bottom-end">
    <span class="dropdown-badge">
      <el-badge :value="noticesNum" :max="99">
        <span class="header-notice-icon">
          <IconifyIconOffline icon="bell" />
        </span>
      </el-badge>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <Tabs
          centered
          class="dropdown-tabs"
          v-model:activeName="activeName"
          @tabClick="tabClick"
        >
          <template v-for="item in notices" :key="item.key">
            <TabPane :tab="`${item.name}(${item.list.length})`">
              <el-scrollbar max-height="330px">
                <div class="noticeList-container">
                  <NoticeList :list="item.list" />
                </div>
              </el-scrollbar>
            </TabPane>
          </template>
        </Tabs>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style>
.ant-tabs-dropdown {
  z-index: 2900 !important;
}
</style>

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

:deep(.ant-tabs-nav) {
  margin-bottom: 0;
}
</style>
