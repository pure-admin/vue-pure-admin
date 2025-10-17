<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
    <ReDrawer />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { checkVersion } from "version-rocket";
import { ElConfigProvider } from "element-plus";
import { ReDialog } from "@/components/ReDialog";
import { ReDrawer } from "@/components/ReDrawer";
import en from "element-plus/es/locale/lang/en";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import plusEn from "plus-pro-components/es/locale/lang/en";
import plusZhCn from "plus-pro-components/es/locale/lang/zh-cn";
import { ElNotification } from "element-plus";

export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog,
    ReDrawer
  },
  computed: {
    currentLocale() {
      return this.$storage.locale?.locale === "zh"
        ? { ...zhCn, ...plusZhCn }
        : { ...en, ...plusEn };
    }
  },
  beforeCreate() {
    const { version, name: title } = __APP_INFO__.pkg;
    const { VITE_PUBLIC_PATH, MODE } = import.meta.env;
    // https://github.com/guMcrey/version-rocket/blob/main/README.zh-CN.md#api
    if (MODE === "production") {
      // 版本实时更新检测，只作用于线上环境
      checkVersion(
        // config
        {
          // 5分钟检测一次版本
          pollingTime: 300000,
          localPackageVersion: version,
          originVersionFileUrl: `${location.origin}${VITE_PUBLIC_PATH}version.json`
        },
        // options
        {
          title,
          description: "检测到新版本",
          buttonText: "立即更新"
        }
      );
    }
  }
  // mounted() {
  //   ElNotification({
  //     title: "平台最新活动与动态",
  //     duration: 0,
  //     customClass: "fullpage-notification",
  //     // @ts-expect-error
  //     style: { width: "260px" },
  //     position: "bottom-right",
  //     dangerouslyUseHTMLString: true,
  //     message: `
  //       <a target='_blank' class='block text-base text-center border mt-4 rounded hover:text-[red]!' href='https://pure-admin.cn/pages/service/#%E6%9C%80%E6%96%B0%E6%B4%BB%E5%8A%A8%E4%B8%8E%E5%8A%A8%E6%80%81'>
  //       点我查看
  //       </a>
  //     `
  //   });
  // }
});
</script>

<style>
.fullpage-notification > .el-notification__group > .el-notification__closeBtn {
  top: 15px;
}
.fullpage-notification > div > h2 {
  color: red;
  font-size: 18px;
}
</style>
