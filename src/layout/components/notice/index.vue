<script setup lang="ts">
import { ref } from "vue";
import NoticeList from "./noticeList.vue";

const loading = ref(false);
const activeName = ref("first");

function visibleChange(val) {
  if (loading.value) {
    loading.value = false;
    return;
  }
  if (!val) return; //防止加载完成后再次点击出现loading
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
}

const noticeList = [
  {
    imgUrl:
      "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
    title: "你收到了 12 份新周报",
    description: "一年前"
  },
  {
    imgUrl:
      "https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png",
    title: "你推荐的 前端高手 已通过第三轮面试",
    description: "一年前"
  },
  {
    imgUrl:
      "https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png",
    title: "这种模板可以区分多种通知类型",
    description: "一年前"
  }
];
const newsList = [];
const agencyList = [];
</script>

<template>
  <el-dropdown
    trigger="click"
    placement="bottom-end"
    @visible-change="visibleChange"
  >
    <span class="dropdown-badge">
      <el-badge :value="12" :max="99">
        <el-icon class="header-notice-icon"><bell /></el-icon>
      </el-badge>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-tabs
          v-model="activeName"
          v-loading="loading"
          class="dropdown-tabs"
          :style="{ width: '297px' }"
        >
          <el-tab-pane label="通知" name="first">
            <NoticeList :list="noticeList" />
          </el-tab-pane>
          <el-tab-pane label="消息" name="second">
            <NoticeList :list="newsList" />
          </el-tab-pane>
          <el-tab-pane label="代办" name="third">
            <NoticeList :list="agencyList" />
          </el-tab-pane>
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
  background-color: #fff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
  border-radius: 4px;

  :deep(.el-tabs__nav-scroll) {
    display: flex;
    justify-content: center;
  }

  :deep(.el-tabs__nav-wrap)::after {
    height: 1px;
  }

  :deep(.el-tabs__content) {
    padding: 0 24px;
  }
}
</style>
