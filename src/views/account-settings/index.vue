<script setup lang="ts">
import { getMine } from "@/api/user";
import { useRouter } from "vue-router";
import { ref, onBeforeMount } from "vue";
import { ReText } from "@/components/ReText";
import Profile from "./components/Profile.vue";
import Preferences from "./components/Preferences.vue";
import SecurityLog from "./components/SecurityLog.vue";
import { useGlobal, deviceDetection } from "@pureadmin/utils";
import AccountManagement from "./components/AccountManagement.vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import LaySidebarTopCollapse from "@/layout/components/lay-sidebar/components/SidebarTopCollapse.vue";

import leftLine from "~icons/ri/arrow-left-s-line";
import ProfileIcon from "~icons/ri/user-3-line";
import PreferencesIcon from "~icons/ri/settings-3-line";
import SecurityLogIcon from "~icons/ri/window-line";
import AccountManagementIcon from "~icons/ri/profile-line";

defineOptions({
  name: "AccountSettings"
});

const router = useRouter();
const isOpen = ref(deviceDetection() ? false : true);
const { $storage } = useGlobal<GlobalPropertiesApi>();
onBeforeMount(() => {
  useDataThemeChange().dataThemeChange($storage.layout?.overallStyle);
});

const userInfo = ref({
  avatar: "",
  username: "",
  nickname: ""
});
const panes = [
  {
    key: "profile",
    label: "个人信息",
    icon: ProfileIcon,
    component: Profile
  },
  {
    key: "preferences",
    label: "偏好设置",
    icon: PreferencesIcon,
    component: Preferences
  },
  {
    key: "securityLog",
    label: "安全日志",
    icon: SecurityLogIcon,
    component: SecurityLog
  },
  {
    key: "accountManagement",
    label: "账户管理",
    icon: AccountManagementIcon,
    component: AccountManagement
  }
];
const witchPane = ref("profile");

getMine().then(res => {
  userInfo.value = res.data;
});
</script>

<template>
  <el-container class="h-full">
    <el-aside
      v-if="isOpen"
      class="pure-account-settings overflow-hidden px-2 dark:bg-(--el-bg-color)! border-r-[1px] border-[var(--pure-border-color)]"
      :width="deviceDetection() ? '180px' : '240px'"
    >
      <el-menu :default-active="witchPane" class="pure-account-settings-menu">
        <div
          class="h-[50px]! text-[var(--pure-theme-menu-text)] cursor-pointer text-sm transition-all duration-300 ease-in-out hover:scale-105 will-change-transform transform-gpu origin-center hover:text-base! hover:text-[var(--pure-theme-menu-title-hover)]!"
          @click="router.go(-1)"
        >
          <div
            class="h-full flex items-center px-[var(--el-menu-base-level-padding)]"
          >
            <IconifyIconOffline :icon="leftLine" />
            <span class="ml-2">返回</span>
          </div>
        </div>
        <div class="flex items-center ml-8 mt-4 mb-4">
          <el-avatar :size="48" :src="userInfo.avatar" />
          <div class="ml-4 flex flex-col max-w-[130px]">
            <ReText class="font-bold self-baseline!">
              {{ userInfo.nickname }}
            </ReText>
            <ReText class="self-baseline!" type="info">
              {{ userInfo.username }}
            </ReText>
          </div>
        </div>
        <el-menu-item
          v-for="item in panes"
          :key="item.key"
          :index="item.key"
          @click="
            () => {
              witchPane = item.key;
              if (deviceDetection()) {
                isOpen = !isOpen;
              }
            }
          "
        >
          <div class="flex items-center z-10">
            <el-icon><IconifyIconOffline :icon="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
          </div>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <LaySidebarTopCollapse
        v-if="deviceDetection()"
        class="px-0"
        :is-active="isOpen"
        @toggleClick="isOpen = !isOpen"
      />
      <component
        :is="panes.find(item => item.key === witchPane).component"
        :class="[!deviceDetection() && 'ml-[120px]']"
      />
    </el-main>
  </el-container>
</template>

<style lang="scss">
.pure-account-settings {
  background: var(--pure-theme-menu-bg) !important;
}

.pure-account-settings-menu {
  background-color: transparent;
  border: none;

  .el-menu-item {
    height: 48px !important;
    color: var(--pure-theme-menu-text);
    background-color: transparent !important;
    transition: color 0.2s;

    &:hover {
      color: var(--pure-theme-menu-title-hover) !important;
    }

    &.is-active {
      color: #fff !important;

      &:hover {
        color: #fff !important;
      }

      &::before {
        position: absolute;
        inset: 0 8px;
        clear: both;
        margin: 4px 0;
        content: "";
        background: var(--el-color-primary);
        border-radius: 3px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
body[layout] {
  .el-menu--vertical .is-active {
    color: #fff !important;
    transition: color 0.2s;

    &:hover {
      color: #fff !important;
    }
  }
}
</style>
