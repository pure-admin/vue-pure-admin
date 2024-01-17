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
import en from "element-plus/dist/locale/en.mjs";
import { ReDialog } from "@/components/ReDialog";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog
  },
  computed: {
    currentLocale() {
      return this.$storage.locale?.locale === "zh" ? zhCn : en;
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
      title: "回顾2023",
      duration: 0,
      dangerouslyUseHTMLString: true,
      message:
        "<a target='_blank' style='font-size: 16px' class='hover:text-[red]' href='https://www.bilibili.com/video/BV1He411m7Qs/'>这更像是三年来开源社区唯一的一次集体交流。欢迎大家在评论区留下您的想法。我们将认真回复所有评论，并将一些不错的建议或想法在2024年实施改进或开发，点击即可去留言</a>"
    });
  }
});
</script>
