<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useNav } from "@/layout/hooks/useNav";
import leftLine from "@iconify-icons/ri/arrow-left-s-line";
import userLine from "@iconify-icons/ri/user-3-line";
import profileLine from "@iconify-icons/ri/profile-line";
import { useRoute, useRouter } from "vue-router";
import { getUserInfo } from "@/api/user";
const route = useRoute();
const router = useRouter();
const { userAvatar, getLogo, username } = useNav();
const defaultActive = ref<string>(route.path as string);
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
</script>

<template>
  <el-container class="h-full py-8">
    <el-aside class="w-70 pure-border-color px-4">
      <el-menu :default-active="defaultActive" router>
        <el-menu-item class="flex items-center" @click="handleBack">
          <IconifyIconOffline :icon="leftLine" />
          <img :src="getLogo()" class="w-6 h-6" alt="logo" />
          <span class="ml-2">返回</span>
        </el-menu-item>
        <li class="flex items-center ml-8 mt-4">
          <div>
            <el-avatar :size="80" :src="userInfo.avatarUrl" />
          </div>
          <div class="pl-4">
            <p>{{ userInfo.nickName }}</p>
            <el-text class="mt-2" type="info">{{ userInfo.userName }}</el-text>
          </div>
        </li>
        <el-menu-item index="/user-settings/user-info-manage">
          <el-icon><IconifyIconOffline :icon="userLine" /></el-icon>
          <span>基本设置</span>
        </el-menu-item>
        <el-menu-item index="/user-settings/safe-manage">
          <el-icon><IconifyIconOffline :icon="profileLine" /></el-icon>
          <span>安全设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.pure-border-color {
  border-color: var(--pure-border-color); /* 使用边框颜色变量 */
}
</style>
