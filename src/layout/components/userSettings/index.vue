<script setup lang="ts">
import { ref } from "vue";
import { useNav } from "@/layout/hooks/useNav";
import leftLine from "@iconify-icons/ri/arrow-left-s-line";
import userLine from "@iconify-icons/ri/user-3-line";
import profileLine from "@iconify-icons/ri/profile-line";
import { useRouter } from "vue-router";
import { getUserInfo } from "@/api/user";

import UserInfoManage from "@/layout/components/userSettings/userInfoManage.vue";
import SafeManage from "@/layout/components/userSettings/safeManage.vue";

const router = useRouter();
const { getLogo, isCollapse } = useNav();
const userInfo = ref({
  nickName: "",
  avatarUrl: "",
  userName: ""
});
getUserInfo().then(res => {
  userInfo.value = res.data;
});
const handleBack = () => {
  router.go(-1);
};

const witchPane = ref("userInfoManage");
const panes = [
  {
    key: "userInfoManage",
    label: "基本设置",
    icon: userLine,
    component: UserInfoManage
  },
  {
    key: "safeManage",
    label: "安全设置",
    icon: profileLine,
    component: SafeManage
  }
];
</script>

<template>
  <el-container class="h-full">
    <el-aside class="settings-sidebar px-2" width="210px">
      <el-menu :default-active="witchPane" class="settings-menu">
        <el-menu-item @click="handleBack">
          <div class="flex items-center">
            <IconifyIconOffline :icon="leftLine" />
            <img :src="getLogo()" class="w-6 h-6" alt="logo" />
            <span class="ml-2">返回</span>
          </div>
        </el-menu-item>
        <li class="flex items-center ml-8 mt-4">
          <div>
            <el-avatar :size="80" :src="userInfo.avatarUrl" />
          </div>
          <div class="pl-4 flex-col">
            <p>{{ userInfo.nickName }}</p>
            <p>
              <el-text class="mt-2" type="info">{{
                userInfo.userName
              }}</el-text>
            </p>
          </div>
        </li>
        <el-menu-item
          v-for="item in panes"
          :key="item.key"
          :index="item.key"
          @click="witchPane = item.key"
        >
          <div class="flex items-center">
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
  background: $menuBg;
}

.settings-menu {
  color: $subMenuActiveText;
  background-color: transparent !important;
  border: none !important;

  ::v-deep(.el-menu-item) {
    position: relative;
    background-color: transparent !important;

    div {
      z-index: 1;
    }

    &.is-active {
      span {
        color: #fff !important;
      }

      i {
        color: #fff !important;
      }

      &::before {
        position: absolute;
        inset: 0 8px;
        margin: 4px 0;
        clear: both;
        content: "";
        background: var(--el-color-primary) !important;
        border-radius: 3px;
      }
    }
  }
}
</style>
