<script setup lang="ts">
import { getMine } from "@/api/user";
import { useRouter } from "vue-router";
import { ref, onBeforeMount } from "vue";
import { useGlobal } from "@pureadmin/utils";
import { ReText } from "@/components/ReText";
import Profile from "./components/profile.vue";
import Preferences from "./components/preferences.vue";
import SecurityLog from "./components/securityLog.vue";
import AccountManagement from "./components/accountManagement.vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import leftLine from "@iconify-icons/ri/arrow-left-s-line";
import ProfileIcon from "@iconify-icons/ri/user-3-line";
import PreferencesIcon from "@iconify-icons/ri/settings-3-line";
import SecurityLogIcon from "@iconify-icons/ri/window-line";
import AccountManagementIcon from "@iconify-icons/ri/profile-line";

defineOptions({
  name: "AccountSettings"
});

const router = useRouter();
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
      class="settings-sidebar px-2 dark:!bg-[var(--el-bg-color)]"
      width="240px"
    >
      <el-menu :default-active="witchPane" class="settings-menu">
        <el-menu-item
          class="hover:!transition-all hover:!duration-200 hover:!text-base !h-[50px]"
          @click="router.go(-1)"
        >
          <div class="flex items-center">
            <IconifyIconOffline :icon="leftLine" />
            <span class="ml-2">返回</span>
          </div>
        </el-menu-item>
        <div class="flex items-center ml-8 mt-4 mb-4">
          <el-avatar :size="48" :src="userInfo.avatar" />
          <div class="ml-4 flex flex-col max-w-[130px]">
            <ReText class="font-bold !self-baseline">
              {{ userInfo.nickname }}
            </ReText>
            <ReText class="!self-baseline" type="info">
              {{ userInfo.username }}
            </ReText>
          </div>
        </div>
        <el-menu-item
          v-for="item in panes"
          :key="item.key"
          :index="item.key"
          @click="witchPane = item.key"
        >
          <div class="flex items-center z-10">
            <el-icon><IconifyIconOffline :icon="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
          </div>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <component :is="panes.find(item => item.key === witchPane).component" />
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.settings-sidebar {
  overflow: hidden;
  background: $menuBg;
  border-right: 1px solid var(--pure-border-color);
}

.settings-menu {
  background-color: transparent;
  border: none;

  ::v-deep(.el-menu-item) {
    height: 48px !important;
    color: $menuText !important;
    background-color: transparent !important;
    transition: color 0.2s;

    &:hover {
      color: $menuTitleHover !important;
    }

    &.is-active {
      color: #fff !important;

      &:hover {
        color: #fff !important;
      }

      &::before {
        position: absolute;
        inset: 0 8px;
        margin: 4px 0;
        clear: both;
        content: "";
        background: var(--el-color-primary);
        border-radius: 3px;
      }
    }
  }
}

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
