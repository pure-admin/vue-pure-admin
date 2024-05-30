<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { checkVersion } from "version-rocket";
import { ElConfigProvider } from "element-plus";
import { ReDialog } from "@/components/ReDialog";
import en from "element-plus/es/locale/lang/en";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import plusEn from "plus-pro-components/es/locale/lang/en";
import plusZhCn from "plus-pro-components/es/locale/lang/zh-cn";
import { ElNotification } from "element-plus";

export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog
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
  },
  mounted() {
    ElNotification({
      title: "通知",
      duration: 0,
      //@ts-expect-error
      style: { width: "340px" },
      position: "bottom-right",
      dangerouslyUseHTMLString: true,
      message: `<a target='_blank' style='font-size: 16px' class='block text-center text-[red] rounded hover:text-[var(--el-color-primary)] border' href='https://pure-admin.github.io/pure-admin-doc/pages/service/#%E6%B0%B8%E4%B9%85%E8%A7%A3%E7%AD%94%E5%BE%AE%E4%BF%A1%E7%BE%A4'>
        永久解答微信群优惠价6月1号当天恢复 原价：<del>￥ 698</del>，现价：￥ 298
        </a>
        `
    });
  }
});
</script>
