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
// import { ElNotification } from "element-plus";

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
  //     title: "优惠活动即将结束",
  //     duration: 0,
  //     //@ts-expect-error
  //     style: { width: "200px" },
  //     position: "bottom-right",
  //     dangerouslyUseHTMLString: true,
  //     message: `
  //       <a target='_blank' style='font-size: 16px' class='block text-center border mb-2 rounded hover:text-[red]' href='https://pure-admin.github.io/pure-admin-doc/pages/js/'>
  //       JS版本
  //       </a>
  //       <a target='_blank' style='font-size: 16px' class='block text-center border mb-2 rounded hover:text-[red]' href='https://pure-admin.github.io/pure-admin-doc/pages/max/'>
  //       Max版本
  //       </a>
  //       `
  //   });
  // }
});
</script>
