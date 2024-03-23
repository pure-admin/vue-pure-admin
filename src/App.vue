<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent, h } from "vue";
import { checkVersion } from "version-rocket";
import { ElConfigProvider, ElNotification } from "element-plus";
import { ReDialog } from "@/components/ReDialog";
import en from "element-plus/dist/locale/en.mjs";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import plusEn from "plus-pro-components/locale/en.mjs";
import plusZhCn from "plus-pro-components/locale/zh-cn.mjs";

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
      title: "最新消息",
      duration: 0,
      position: "bottom-right",
      dangerouslyUseHTMLString: true,
      message: `<a target='_blank' style='font-size: 16px' class='block text-center border mb-2 rounded hover:text-[red]' href='https://github.com/pure-admin/vue-pure-admin/issues/994'>
        5.2.0 版本已发布，精简版已同步
        </a>
        <a target='_blank' style='font-size: 16px' class='block text-center hover:text-[red] rounded border mb-2' href='https://www.bilibili.com/video/BV1Rx4y1U7Mv/'>
        vue-pure-admin 的所有<br>页面、功能演示、后续计划
        </a>
        <a target='_blank' style='font-size: 16px' class='block text-center text-[red] rounded hover:text-[var(--el-color-primary)] border' href='https://yiming_chang.gitee.io/pure-admin-doc/pages/service/#%E6%B0%B8%E4%B9%85%E8%A7%A3%E7%AD%94%E5%BE%AE%E4%BF%A1%E7%BE%A4'>
        永久解答服务不久后恢复原价感兴趣的朋友可以入手啦
        </a>
      `
    });
  }
});
</script>
